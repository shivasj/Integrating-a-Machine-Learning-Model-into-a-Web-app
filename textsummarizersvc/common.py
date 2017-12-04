import logging
from logging.handlers import TimedRotatingFileHandler

class Logger:

    def __init__(self,log_file='app.log'):
        self.log_file = "logs/"+log_file
        self.logger = logging.getLogger(log_file)
        self.logger.setLevel(logging.INFO)

        if len(self.logger.handlers) == 0:
            self.handler = TimedRotatingFileHandler(self.log_file,
                                               when="midnight",interval=1)

            # create a logging format
            self.formatter = logging.Formatter('%(asctime)s - %(message)s')
            self.handler.setFormatter(self.formatter)

            print(self.logger.handlers)
            self.logger.addHandler(self.handler)
            print(self.logger.handlers)

    def log(self,message):
        self.logger.info(message)

    def exception(self,message):
        self.logger.exception(message)