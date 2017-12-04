# Integrating a Machine Learning Model into a Web app

In this post I will go over how to expose a machine learning model in a web application. Here is the technology stack in order to expose a machine learning model from Python into a web application.

![alt text](https://1.bp.blogspot.com/-TV0jJ_2WBWM/WiR5eIslA9I/AAAAAAAA7Pg/N80zHGJjo_UYFxaEd9XhfFatghRfcTbRwCLcBGAs/s1600/Screen%2BShot%2B2017-12-03%2Bat%2B5.23.27%2BPM.png)

Our first step is to encapsulate all the logic we want into a python class. In this example we already have a pre-trained model which was serialized into a pickle object. So in the class init method we load your persisted trained model. This object can be used for prediction from the web application.

![alt text](https://4.bp.blogspot.com/-oMobwV8hn88/WiR6xWy7clI/AAAAAAAA7Pw/PAaRux1FLfstoay998fpWtq3sQU34PDeQCLcBGAs/s1600/Screen%2BShot%2B2017-12-03%2Bat%2B5.27.12%2BPM.png)

There are two methods defined "classify" and "train" which we will expose as rest apis in the next section.

The second step is to expose rest apis that our web application would like to call. For this we will your Flask. The two apis we need from the last section are "classify_review" and "train_review". Both these are mapped to the invoke the MovieClassifier class and the appropriate methods within it. The return object from both these are json object of the results from the machine learning model.

![alt text](https://2.bp.blogspot.com/-WHQbSnP0WPg/WiR6xdNo0YI/AAAAAAAA7P0/EWFyDHq2B7cTpk4QMi-4wF3KVUkWeJkywCEwYBhgL/s1600/Screen%2BShot%2B2017-12-03%2Bat%2B5.27.34%2BPM.png)

Once we have the rest api's defined in Flask, we can run the flask app and we should see something like this:

![alt text](https://3.bp.blogspot.com/-z9hyPfqcYwo/WiSXP_Y2g4I/AAAAAAAA7QM/bOylHR7fNoIVNhjf8lngm21kyHGdT-RiwCLcBGAs/s1600/Screen%2BShot%2B2017-12-03%2Bat%2B7.30.30%2BPM.png)

The rest apis are available as the following end points:
http://localhost:5010/classify_review?_id=5a24705fe3e52a74e2e02741
http://localhost:5010/train_review?_id=5a24705fe3e52a74e2e02741
where _id is the id of the content in our database.

These rest apis we just created can be wired into our AngularJS web application as shown below:

![alt text](https://2.bp.blogspot.com/-lwFsWmNj4_I/WiR6xbaTi4I/AAAAAAAA7Ps/snnicySapy0sc26AT4gC2rJH5UVciee1QCEwYBhgL/s1600/Screen%2BShot%2B2017-12-03%2Bat%2B5.28.10%2BPM.png)

We now can consume these methods in our web application. Our application has two functions, text summarization and Sentiment Analysis.

![alt text](https://4.bp.blogspot.com/-LN7z2ixO2fI/WiSYyBJ_sTI/AAAAAAAA7QY/LiXMudIUgkwoPHqy7O_cH4WXX4PjWzx1gCLcBGAs/s1600/Screen%2BShot%2B2017-12-03%2Bat%2B7.35.19%2BPM.png)

Let us look at the sentiment analysis. Every time a new review is entered we store this in our backend database. We also classify the text using our pre-trained model for the sentiment. The following screen show all the reviews we have already tested.

![alt text](https://4.bp.blogspot.com/-L9SCxZ-umAc/WiSYzUmIJyI/AAAAAAAA7Qo/gWceXFj3QkklcYlfRbIKtMMR3ht3NFqEwCLcBGAs/s1600/Screen%2BShot%2B2017-12-03%2Bat%2B7.36.31%2BPM.png)

We shall enter a new review "The movie was awesome" and submit.

![alt text](https://2.bp.blogspot.com/--Or9Go6uTvs/WiSYyDNYZQI/AAAAAAAA7Qc/BGkNBddRvsMFNQm-q2z8SQlm6zqZezM-QCLcBGAs/s1600/Screen%2BShot%2B2017-12-03%2Bat%2B7.36.03%2BPM.png)

The following results will show up. Notice that the sentiment of "positive" and probability % was computed from the Flask rest api and retrieved to the user to display in the front end page.


![alt text](https://2.bp.blogspot.com/-mIf26NXlsMo/WiSYyt7FjiI/AAAAAAAA7Qg/tU_KD0KXOmEcWRSpCUrZxfQC8I-gCBW4gCLcBGAs/s1600/Screen%2BShot%2B2017-12-03%2Bat%2B7.36.14%2BPM.png)

If we go to view all the sentiments we entered, we can see the new one we just entered. All is this is stored in the database.

![alt text](https://3.bp.blogspot.com/-pl7LsgMy1ko/WiSYyJQmnuI/AAAAAAAA7Qk/UiLdPmPAsvQAOhh1ZCWp_MCf6k_CNgdCACLcBGAs/s1600/Screen%2BShot%2B2017-12-03%2Bat%2B7.35.36%2BPM.png)