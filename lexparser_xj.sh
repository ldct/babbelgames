#!/usr/bin/env bash
#
# Runs the English PCFG parser on one or more files, printing trees only

if [ ! $# -ge 1 ]; then
  echo Usage: `basename $0` 'file(s)'
  echo
  exit
fi

scriptdir=`dirname $0`

java -mx150m -Xmx30000m -cp "$scriptdir/*:" edu.stanford.nlp.parser.lexparser.LexicalizedParser \
 -outputFormat "oneline" -maxLength 15 -writeOutputFiles -nthreads 3 edu/stanford/nlp/models/lexparser/frenchFactored.ser.gz $*
