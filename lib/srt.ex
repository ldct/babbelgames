defmodule Srt do

    def mostOverlappedEntry(%{:time => time}, l2Entries) do

        {idx, score} = l2Entries
        |> Enum.map(fn %{:time => t } -> overlap(t, time) end)
        |> Util.argmaxAndMax

        {Enum.at(l2Entries, idx), score}

    end

    def parseTranscriptLine(line) do
        parts = line
        |> String.split(": ", parts: 2)

        cond do
           (parts |> Enum.at(0)) == nil -> nil
           (parts |> Enum.at(1)) == nil -> nil
           true -> %{
            :speaker => parts |> Enum.at(0),
            :line => parts |> Enum.at(1) |> Nlp.canonicalize
           }
        end

    end

    def parseTranscriptForLines(transcriptFilename) do
        transcriptFilename
        |> File.read!
        |> Nlp.expandShortForms
        |> String.split("\n")
        |> Enum.map(fn x -> Nlp.removeParens(x) end)
        |> Stream.with_index
        |> Enum.filter(fn {x, _} -> (String.length x) > 0 end)
        |> Enum.filter(fn {x, _} -> x |> String.contains?(":") end)
        |> Enum.map(fn {x, l} -> {(parseTranscriptLine x), l} end)
        |> Enum.filter(fn {x, _} -> (x != nil) end)
    end

    def addSpeakerToSrtLine(srtLine, transcriptLineInfo) do

        line = srtLine
        |> Map.fetch!(:l1)
        |> Nlp.canonicalize
        |> String.downcase

        matchingTLIs = transcriptLineInfo
        |> Enum.filter(fn {l, _} ->
            (String.length(line) > 0) && l
            |> Map.fetch!(:line)
            |> String.contains?(line)
        end)

        case matchingTLIs do
            [{%{:speaker => s}, l}] ->
                srtLine |> Map.merge(%{
                    :speaker => s,
                    :lineNumber => l,
                })
            _ -> srtLine
        end
    end

    def checkedLisOnLineNumber(arr) do
        "checkedLisOnLineNumber" |> IO.inspect
        arr |> length |> IO.inspect
        ret = arr |> lisOnLineNumber
        ret |> length |> IO.inspect
        ret
    end

    def lisOnLineNumber(arr) do # todo: this doesn't actually do LIS

        lineNumbers = arr
        |> Enum.flat_map(fn
            %{:lineNumber => l} -> [l]
            _ -> []
        end)
        |> Longest_increasing_subsequence.patience_lis

        lisOnLineNumber(arr, lineNumbers)

    end

    def lisOnLineNumber(arr, lineNumbers) do
        case {arr, lineNumbers} do
            {[], _} -> []
            {_, []} ->
                arr |> Enum.map(fn
                        %{:l1 => l1, :l2 => l2} -> %{:l1 => l1, :l2 => l2}
                    end)
            {[x = %{:lineNumber => l} | r1], [l | r2]} ->
                [x | lisOnLineNumber(r1, r2)]
            {[%{:l1 => l1, :l2 => l2, :lineNumber => _} | r1], r2} -> [%{:l1 => l1, :l2 => l2} | lisOnLineNumber(r1, r2)]
            {[x | r1], r2} -> [x | lisOnLineNumber(r1, r2)]
        end
    end

    def pairSrt(l1Filename, l2Filename, transcriptFilename) do
        l1 = l1Filename |> parseSrt |> IO.inspect
        l2 = l2Filename |> parseSrt |> IO.inspect

        transcriptLineInfo = transcriptFilename
        |> parseTranscriptForLines

        l1
        |> Enum.map(fn e -> pairEntry(e, l2) end)
        |> Enum.filter(fn %{:score => score} -> score > 0.5 end)
        |> Enum.flat_map(fn p -> splitSrtPairsSentences(p) end)
        |> Enum.map(fn x -> x |> Srt.addSpeakerToSrtLine(transcriptLineInfo) end) # todo: now run LIS to delete wrong matches
        |> Srt.checkedLisOnLineNumber
        |> Enum.map(fn
            %{ :l1 => a, :l2 => b, :speaker => s, :lineNumber => l} -> {a |> Nlp.invertEllipses, b |> Nlp.invertEllipses, s, l}
            %{ :l1 => a, :l2 => b} -> {a |> Nlp.invertEllipses, b |> Nlp.invertEllipses}
        end)

    end

    def pairSrt(l1Filename, l2Filename) do
        l1 = l1Filename |> parseSrt
        l2 = l2Filename |> parseSrt

        l1
        |> Enum.map(fn e -> pairEntry(e, l2) end)
        |> Enum.filter(fn %{:score => score} -> score > 0.5 end)
        |> Enum.map(fn
            %{ :l1 => a, :l2 => b, :speaker => s} -> {a |> Nlp.invertEllipses, b |> Nlp.invertEllipses, s}
            %{ :l1 => a, :l2 => b} -> {a |> Nlp.invertEllipses, b |> Nlp.invertEllipses}
        end)
    end

    def splitSrtPairsSentences(p) do
        %{:l1 => l1, :l2 => l2} = p

        l1Lines = l1 |> String.split(~r/[!?\.](?=.)/u)
        l2Lines = l2 |> String.split(~r/[!?\.](?=.)/u)

        cond do
            (length l1Lines) == (length l2Lines) ->
                Enum.zip(l1Lines, l2Lines) |> Enum.map(fn {l1Line, l2Line} ->
                    %{
                        :l1 => l1Line,
                        :l2 => l2Line,
                    }
                end)
            true ->
                [%{
                    :l1 => l1,
                    :l2 => l2,
                }]
        end
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
        |> IO.inspect
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

        lines = Enum.slice(arr, 2..-1)
        |> Enum.map(fn l ->
            l
            |> String.replace(~r/\<.*\>/uU, "")
            |> String.replace(~r/^\-/u, "")      # todo: this is removing speaker line markers
            |> String.replace(~r/^\ +/u, "")
            |> String.replace(~r/\.\.\./u, "/ELLIPSES/")
        end)

        %{
          "time": [start_time, end_time],
          'lines': lines |> Enum.join(" ")
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
