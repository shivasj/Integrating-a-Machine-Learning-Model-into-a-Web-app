from flask import Flask, request, make_response, abort
from flask_restful import Resource, Api
from pymongo import MongoClient
import gridfs
from gridfs.errors import NoFile
import datetime
import json
import bson
from bson.json_util import dumps,default
from flask_cors import CORS

# Project Python files
import textsummarizer as ts
import movieclassifier as mc
import appconfig as config
import common

# Initialization
service = Flask(__name__);
CORS(service);
api = Api(service);
logger = common.Logger()
settings = config.Settings()
client = MongoClient(settings.mongodb)
db = client[settings.mongodb_database];
fs = gridfs.GridFS(db)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, bson.ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

class Root(Resource):
    def get(self):
        return {'root': 'api is working!'}

class SummarizeText(Resource):
    def get(self):

        _id = request.args.get("_id");
        word_limit = int(request.args.get("word_limit"));
        logger.log(_id);
        dbcollection = db['content'];
        result = dbcollection.find_one({'_id': bson.ObjectId(_id)});
        content_text = result['content_text'];

        model = ts.TextSummarizer()
        summary = model.summarize(_id,content_text,word_limit)

        # Update the summary results to db
        update = dbcollection.update_one({"_id": bson.ObjectId(_id)}, {"$set": summary}, upsert=True);

        return summary

class ClassifyReview(Resource):
    def get(self):

        _id = request.args.get("_id");
        logger.log(_id);
        dbcollection = db['review'];
        result = dbcollection.find_one({'_id': bson.ObjectId(_id)});
        review_text = result['review_text'];

        model = mc.MovieClassifier()
        prediction = model.classify(_id, review_text)

        # Update the prediction results to db
        update = dbcollection.update_one({"_id": bson.ObjectId(_id)}, {"$set": prediction}, upsert=True);

        return prediction

class TrainReview(Resource):
    def get(self):

        _id = request.args.get("_id");
        y = request.args.get("y");
        logger.log(_id);
        dbcollection = db['review'];
        result = dbcollection.find_one({'_id': bson.ObjectId(_id)});
        review_text = result['review_text'];

        model = mc.MovieClassifier()
        model.train(_id, review_text,y);

        # Update the prediction results to db
        update = dbcollection.update_one({"_id": bson.ObjectId(_id)}, {"$set": {'y':y}}, upsert=True);

        return {}

class Collection(Resource):
    def get(self,collection):
        dbcollection = db[collection];
        logger.log(request.values);
        q = request.args.get("q");
        logger.log(q);
        result = dbcollection.find(json.loads(q));
        return {collection:json.loads(dumps(result))};

    def post(self,collection):
        dbcollection = db[collection];
        logger.log(request.json);
        newItem = request.json;
        #newItem = json.loads(request.json);
        result = dbcollection.insert_one(newItem);
        logger.log(result);
        _id = result.inserted_id;
        logger.log(_id);
        #return "{'_id':'"+str(_id)+"'}";
        return json.loads(dumps(_id));

    def delete(self,collection):
        dbcollection = db[collection];
        q = request.args.get("q");
        logger.log(q);
        result = dbcollection.delete_many(json.loads(q));
        logger.log("result.deleted_count",result.deleted_count);
        return {"deleted_count":result.deleted_count};

class Item(Resource):
    def get(self,collection,_id):
        dbcollection = db[collection];
        result = dbcollection.find_one({'_id': bson.ObjectId(_id)});
        return json.loads(dumps(result));

    def post(self,collection,_id):
        dbcollection = db[collection];
        updateFields = request.json;
        logger.log(updateFields);
        result = dbcollection.update_one({"_id": bson.ObjectId(_id)},{"$set": updateFields},upsert=True);
        return {"modified_count":result.modified_count};

class Distinct(Resource):
    def get(self,collection,column):
        dbcollection = db[collection];
        logger.log("###########",column)
        result = dbcollection.distinct(column);
        logger.log(result)
        return json.loads(dumps(result));

class UploadFile(Resource):
    def post(self):
        logger.log('Upload file')
        file = request.files['file']
        logger.log(file.filename,file.content_type)
        oid = fs.put(file,content_type=file.content_type, filename=file.filename)
        logger.log(oid)
        return json.loads(dumps(oid));

class File(Resource):
    def get(self,_id):
        try:
            logger.log(_id)
            file = fs.get(bson.ObjectId(_id))
            response = make_response(file.read())
            response.mimetype = file.content_type
            attachment = request.args.get("attachment");
            if attachment != 'false':
                response.headers.set('Content-Disposition', 'attachment', filename=file.filename)
            return response
        except NoFile:
            abort(404)
    def delete(self,_id):
        try:
            logger.log(_id)
            fs.delete(_id)
            return {"deleted":True};
        except NoFile:
            return {"deleted":False};


api.add_resource(Root, '/');
api.add_resource(SummarizeText, '/summarize_text');
api.add_resource(ClassifyReview, '/classify_review');
api.add_resource(TrainReview, '/train_review');

api.add_resource(UploadFile, '/file');
api.add_resource(File, '/file/<_id>');
api.add_resource(Distinct, '/distinct/<collection>/<column>');
api.add_resource(Collection, '/<collection>');
api.add_resource(Item, '/<collection>/<_id>');

if __name__ == '__main__':
    logger.log("Starting Flask Service......")
    service.run(
        host=settings.host,
        port=settings.port,
        threaded=True,
        debug=False
    )