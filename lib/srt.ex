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

    def pairSrt(l1Filename, l2Filename) do
        l1 = l1Filename |> parseSrt
        l2 = l2Filename |> parseSrt

        l1
        |> Enum.map(fn e -> pairEntry(e, l2) end)
        |> IO.inspect
        |> Enum.filter(fn {_, _, score} -> score > 0.3 end)
        |> Enum.map(fn {a, b, _} -> {a, b} end)
        # :ok
    end

    def pairEntry(entry, l2) do
        {l2Entry, score} = mostOverlappedEntry(entry, l2)
        {
            entry |> Map.fetch!(:lines),
            l2Entry |> Map.fetch!(:lines),
            score
        }
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
        |> IO.inspect
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