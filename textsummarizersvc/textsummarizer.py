import json
import pytextrank

import common

class TextSummarizer:
    # Logger
    logger = common.Logger()

    # Class Text Summarizer
    def __init__(self):
        self.logger.log("TextSummarizer ------------------------------------ Init")

    def summarize(self, _id,content_text,word_limit):
        self.logger.log("_id: "+_id)
        self.logger.log("word_limit: " + str(word_limit))

        # File names
        path_stage0 = 'process/'+_id+'.json'
        path_stage1 = 'process/' + _id + '_o1.json'
        path_stage2 = 'process/' + _id + '_o2.json'
        path_stage3 = 'process/' + _id + '_o3.json'
        path_stage4 = 'process/' + _id + '_o4.json'

        # Create input file
        with open(path_stage0, 'w') as outfile:
            json.dump({"id":"123", "text":content_text}, outfile)

        # Statistical Parsing - Stage 1
        # Perform statistical parsing/tagging on a document in JSON format
        with open(path_stage1, 'w') as f:
            for graf in pytextrank.parse_doc(pytextrank.json_iter(path_stage0)):
                f.write("%s\n" % pytextrank.pretty_print(graf._asdict()))


        # Ranked Keyphrases - Stage 2
        # Collect and normalize the key phrases from a parsed document
        graph, ranks = pytextrank.text_rank(path_stage1)
        pytextrank.render_ranks(graph, ranks)

        with open(path_stage2, 'w') as f:
            for rl in pytextrank.normalize_key_phrases(path_stage1, ranks):
                f.write("%s\n" % pytextrank.pretty_print(rl._asdict()))

        # Extractive Summarization -  Stage 3
        # Calculate a significance weight for each sentence, using MinHash to approximate a Jaccard distance from key phrases determined by TextRank
        kernel = pytextrank.rank_kernel(path_stage2)

        with open(path_stage3, 'w') as f:
            for s in pytextrank.top_sentences(kernel, path_stage1):
                f.write(pytextrank.pretty_print(s._asdict()))
                f.write("\n")

        # Final Output - Stage 4
        # Summarize a document based on most significant sentences and key phrases
        phrases = ", ".join(set([p for p in pytextrank.limit_keyphrases(path_stage2, phrase_limit=12)]))
        sent_iter = sorted(pytextrank.limit_sentences(path_stage3, word_limit=word_limit), key=lambda x: x[1])
        s = []

        for sent_text, idx in sent_iter:
            s.append(pytextrank.make_sentence(sent_text))

        graf_text = " ".join(s)

        return {'excerpts':graf_text,'keywords':phrases}
