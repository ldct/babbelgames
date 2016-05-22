defmodule Srt do

    def indexIn(element, collection) do
        collection
        |> Enum.find_index(fn e -> e == element end)
    end

    def mostOverlappedEntry(entry, l2Entries) do
        time = entry
        |> Map.fetch!(:time)

        scores = l2Entries
        |> Enum.map(fn e -> e |> Map.fetch!(:time) |> overlap(time) end)

        score = Enum.max(scores)

        idx = indexIn(score, scores)

        {Enum.at(l2Entries, idx), score}

    end

    def removeParens(str) do
        str |> String.replace(~r/\(.*\)/sU, "")
        |> String.replace(~r/\<.*\)/sU, "")
    end

    def collapseWhitespace(str) do
        str |> String.replace(~r/\ +/, " ")
    end

    def parseTranscriptLine(line) do
        parts = line
        |> String.split(": ", parts: 2)

        cond do
           (parts |> Enum.at(0)) == nil -> nil
           (parts |> Enum.at(1)) == nil -> nil
           true -> %{
            :speaker => parts |> Enum.at(0),
            :line => parts |> Enum.at(1) |> Nlp.stripPunctuation |> Srt.collapseWhitespace
           }
        end

    end

    def parseTranscriptForLines(transcriptFilename) do
        transcriptFilename
        |> File.read!
        |> Srt.removeParens
        |> String.replace("d’", "do ")
        |> String.replace("gonna", "going to")
        |> String.split("\n")
        |> Enum.filter(fn x -> (String.length x) > 0 end)
        |> Enum.filter(fn x -> x |> String.contains?(":") end)
        |> Enum.map(fn x -> parseTranscriptLine x end)
        |> Enum.filter(fn x -> x != nil end)
    end

    def addSpeakerToSrtLine(srtLine, transcriptLineInfo) do

        line = srtLine
        |> Map.fetch!(:lines)
        |> Nlp.stripPunctuation
        |> String.downcase

        matchingTLIs = transcriptLineInfo
        |> Enum.filter(fn tli ->
            tli
            |> Map.fetch!(:line)
            |> String.contains?(line)
        end)

        cond do
          (matchingTLIs |> length) == 1 ->
            srtLine |> Map.merge(%{
                :speaker => matchingTLIs |> Enum.at(0) |> Map.fetch!(:speaker),
            })
            true -> srtLine
        end
    end

    def pairSrtWithTranscript(srtFilename, transcriptFilename) do


        srtEntries = srtFilename
        |> parseSrt
        |> Enum.slice(0..100)


    end

    def pairSrt(l1Filename, l2Filename, transcriptFilename) do
        l1 = l1Filename |> parseSrt
        l2 = l2Filename |> parseSrt

        transcriptLineInfo = transcriptFilename
        |> parseTranscriptForLines

        l1
        |> Enum.map(fn x -> x |> Srt.addSpeakerToSrtLine(transcriptLineInfo) end)
        |> Enum.map(fn e -> pairEntry(e, l2) end)
        |> Enum.filter(fn %{:score => score} -> score > 0.5 end)
        |> Enum.map(fn
            %{ :l1 => a, :l2 => b, :speaker => s} -> {a, b, s}
            %{ :l1 => a, :l2 => b} -> {a, b}
        end)

    end

    def pairSrt(l1Filename, l2Filename) do
        l1 = l1Filename |> parseSrt
        l2 = l2Filename |> parseSrt

        l1
        |> Enum.map(fn e -> pairEntry(e, l2) end)
        |> Enum.filter(fn %{:score => score} -> score > 0.5 end)
        |> Enum.map(fn
            %{ :l1 => a, :l2 => b, :speaker => s} -> {a, b, s}
            %{ :l1 => a, :l2 => b} -> {a, b}
        end)
    end

    def pairEntry(entry, l2) do
        {l2Entry, score} = mostOverlappedEntry(entry, l2)
        case {entry, l2Entry} do
            {%{:lines => l1, :speaker => speaker}, %{:lines => l2}} -> %{
                :l1 => l1,
                :l2 => l2,
                :score => score,
                :speaker => speaker
            }
            {%{:lines => l1}, %{:lines => l2}} -> %{
                :l1 => l1,
                :l2 => l2,
                :score => score
            }
        end
    end

    def overlap(t1, t2) do

        overlap_start = [Enum.at(t1, 0), Enum.at(t2, 0)] |> Enum.max
        overlap_end = [Enum.at(t1, 1), Enum.at(t2, 1)] |> Enum.min

        union_start = [Enum.at(t1, 0), Enum.at(t2, 0)] |> Enum.min
        union_end = [Enum.at(t1, 1), Enum.at(t2, 1)] |> Enum.max

        overlap_length = overlap_end - overlap_start
        overlap_length = Enum.max([overlap_length, 0])

        union_length = union_end - union_start

        overlap_length / union_length
    end

    def parseSrt(filename) do
        filename
        |> File.read!
        |> String.replace("\r\n\r\n\r\n", "\r\n\r\n")
        |> String.split("\r\n\r\n")
        |> Enum.filter(fn e -> isEmptyEntry e end)
        |> Enum.map(fn e -> parseSrtEntry e end)
    end

    def isEmptyEntry(entry) do
        entry
        |> String.split("\r\n")
        |> length
        >= 2
    end

    def parseSrtEntry(entry) do
        arr = entry
        |> String.split("\r\n")

        time = arr
        |> Enum.at(1)
        |> String.split(" --> ")

        [start_time, end_time] = time
        |> Enum.map(fn t -> parseTime t end)

        %{
          "time": [start_time, end_time],
          'lines': Enum.slice(arr, 2..-1) |> Enum.join(" ")
        }
    end

    def parseTime(time) do
        [h, m, s] = time
        |> String.replace(",", ".")
        |> String.split(":")

        {h, _} = Float.parse(h)
        {m, _} = Float.parse(m)
        {s, _} = Float.parse(s)

        h*60*60 + m*60 + s
    end

end