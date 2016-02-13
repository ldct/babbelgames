#!/usr/bin/env bash

read var
echo $var > /tmp/french_sentence

java -mx150m -Xmx4098m -cp "./stanford-parser/*:" edu.stanford.nlp.parser.lexparser.LexicalizedParser -outputFormat "penn" edu/stanford/nlp/models/lexparser/frenchFactored.ser.gz /tmp/french_sentence 2>/dev/null
