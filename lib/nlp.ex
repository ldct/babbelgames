defmodule Nlp do

    def hexDigest(str) do
        :crypto.hash(:sha256, str) 
        |> Base.encode16
        |> String.downcase
    end

    def parseSentenceToSerializedSexpr(sentence) do
        File.write!("/tmp/french_sentence", sentence)
        {sexpr, 0} = System.cmd("java",  [
            "-mx150m", "-Xmx4098m", 
            "-cp", "./stanford-parser/*:", 
            "edu.stanford.nlp.parser.lexparser.LexicalizedParser",
            "-outputFormat", "penn", 
            "edu/stanford/nlp/models/lexparser/frenchFactored.ser.gz",
            "/tmp/french_sentence"])
        sexpr
    end

    def parseAndCacheSentence(sentence) do 
        filename = "parsedSentences/" <> hexDigest(sentence)
        File.write!(filename, sentence <> "\n" <> parseSentenceToSerializedSexpr(sentence))
    end

    def parseAndCacheAllSentences() do
        fr = File.stream!("opus-OS/en-fr/fr")

        frSentence = fr |> Enum.map(fn (sentence) -> sentence 
            |> String.replace("\n", "") 
            |> String.replace(~r/^- /, "")
            |> parseAndCacheSentence
        end)
    end

    # usage: Nlp.parseSentence("Je baisse les yeux et je vois un telephone")
    def parseSentence(sentence) do
        {:ok, parsed} = parseSentenceToSerializedSexpr(sentence)
        |> String.replace("PUNC \"", "PUNC DOUBLEQUOTE")
        |> SymbolicExpression.Parser.parse
        parsed
    end

    # extract top-level constituents of sentence
    def extractMinimumConstituents(sentence) do
        parsed = sentence |> parseSentence
        ["ROOT", ["SENT" | sentenceConstituents]] = parsed
        sentenceConstituents
        |> Enum.map(fn t -> Nlp.collect(t) end)
    end

    # extract constituents of sentence that are no
    # more than 3 words long, greedily
    def extractChunkedConstituents(sentence) do
        parsed = sentence |> parseSentence
        ["ROOT", sent] = parsed
        extractChunkedConstituentsTree(sent)
    end

    def extractChunkedConstituentsTree(tree) do

        IO.inspect("extractChunkedConstituentsTree")
        IO.inspect(tree)

        len = tree
        |> collect
        |> String.split(" ")
        |> length

        if len <= 3 do
            [collect(tree)]
        else
            [_ | children] = tree
            children
            |> Enum.map(fn t -> extractChunkedConstituentsTree(t) end)
            |> List.flatten
        end
    end

    # collect leaves
    def collect(tree) do
        cond do
            is_list(tree) ->
                [_ | rest] = tree
                rest
                |> Enum.map(fn t -> Nlp.collect(t) end)
                |> Enum.join(" ")
            is_binary(tree) ->
                tree
            true ->
                "\n\n\nWTF\n" 
                |> IO.inspect
                tree
                |> IO.inspect
        end
    end

    # tokenize stanford NLP parse tree output

    def tokenize(str) do
        tokenizeFrom(str, 0, "")
    end

    def singletonOrEmpty(s) do
        if s == "" do
            []
        else
            [s]
        end
    end

    def tokenizeFrom(str, n, prefix) do
        # tokenize prefix + str[n:] where prefix
        # does not contain [\(\)\s]
        cond do
            String.length(str) == n ->
                singletonOrEmpty(prefix)
            String.at(str, n) == "(" -> 
                ["("] ++ tokenizeFrom(str, n+1, "")
            String.at(str, n) == ")" -> 
                [")"] ++ tokenizeFrom(str, n+1, "")
            String.at(str, n) == " " ->
                singletonOrEmpty(prefix) ++ tokenizeFrom(str, n+1, "")
            true -> 
                tokenizeFrom(str, n+1, prefix <> String.at(str, n))
        end
    end

    # j'ai -> je ai etc

    def deconjugate(word) do
        # todo: this is probably wrong
        # todo: assert that there is no more than one ' in a row
        # todo: dashes in word?
        word
        |> String.split(~r/(?<=')/) # split after '
        |> Enum.map(fn s -> String.replace(s, "'", "e") end)
        |> Enum.map(fn s -> String.replace(s, ",", "") end)
        |> Enum.map(fn s -> String.replace(s, ".", "") end)
        |> Enum.map(fn s -> String.replace(s, "\n", "") end) # just in case
        |> Enum.map(fn s -> String.replace(s, "\"", "") end)
        |> Enum.map(fn s -> String.downcase(s) end)
    end

    def segment(sentence) do
        sentence
        |> String.split(" ")
        |> Enum.map(fn s -> deconjugate(s) end)
        |> List.flatten
    end

    def parseConstituents(frenchSentence) do
        Porcelain.exec("bash", ["./parse_french_sentence.sh"], in: frenchSentence <> "\n").out
        |> String.replace("\n", " ")
    end


    def wordRanks(frenchSentence) do
        frenchSentence
        |> segment
        |> Enum.map(fn w -> wordHardnessScore(w) end)
        |> Enum.filter(fn s -> s != nil end)
    end

    # todo: multiple sentences (separated by spaces) :(

    def averageWordRankScore(frenchSentence) do
        frenchSentence |> wordRanks |> average
    end

    def highestWordRankScore(frenchSentence) do
        frenchSentence |> wordRanks |> max
    end

    def sumWordRankScore(frenchSentence) do
        frenchSentence |> wordRanks |> Enum.sum
    end

    def average(l) do
        if length(l) == 0 do
            nil
        else
            Enum.max(l) / length(l)
        end
    end

    def max(l) do 
        if length(l) == 0 do
            nil
        else
            Enum.max(l)
        end
    end

    def indexOf(collection, element) do
        collection
        |> Enum.find_index(fn e -> e == element end)
    end

    def wordHardnessScore(word) do
        File.read!("frequency_list")
        |> String.split("\n")
        |> indexOf(word)
    end

end