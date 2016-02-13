defmodule Nlp do

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