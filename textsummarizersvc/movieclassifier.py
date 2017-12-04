import pickle
import numpy as np

import common
from vectorizer import vect

class MovieClassifier:
    # Logger
    logger = common.Logger()
    clf = None

    # Class Movie Classifier
    def __init__(self):
        self.logger.log("MovieClassifier ------------------------------------ Init")
        self.clf = pickle.load(open('movieclassifier/pkl_objects/classifier.pkl', 'rb'))

    def classify(self, _id,review_text):
        self.logger.log("_id: "+_id)

        X = vect.transform([review_text])
        y = self.clf.predict(X)[0]
        proba = np.max(self.clf.predict_proba(X))
        self.logger.log("y: " + str(y))
        self.logger.log("proba: " + str(proba))

        return {'y':int(y),'proba':proba}

    def train(self,_id,review_text,y):
        self.logger.log("_id: " + _id)
        X = vect.transform([review_text])
        classes = np.array([0, 1])
        self.clf.partial_fit(X, [y],classes=classes)