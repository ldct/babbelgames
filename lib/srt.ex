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
        |> String.split("\n")
        |> Enum.map(fn x -> Nlp.removeParens(x) end)
        |> Stream.with_index
        |> Enum.filter(fn {x, _} -> (String.length x) > 0 end)
        |> Enum.filter(fn {x, _} -> x |> String.contains?(":") end)
        |> Enum.map(fn {x, l} -> {(parseTranscriptLine x), l} end)
        |> Enum.filter(fn {x, _} -> (x != nil) end)
    end

    def heuristicAddSpeakerToSrtLine(srtLine, transcriptLineInfo) do

        needle = srtLine
        |> Map.fetch!(:l1)
        |> Nlp.canonicalize

        cond do
            (needle |> String.length) > 0 ->
                matches = transcriptLineInfo
                |> Enum.map(fn
                    {%{:line => hay, :speaker => s}, l} ->
                        score = needle
                        |> String.split(" ")
                        |> Enum.map(fn w ->
                            String.contains?(hay, w)
                        end)
                        |> Util.fractionTrue
                        {score, s, l}
                end)
                |> Enum.filter(fn {score, _, _} -> score > 0.5 end)

                if (matches |> length) == 1 do
                    [{_, speaker, lineNumber}] = matches
                    srtLine |> Map.merge(%{
                        :speaker => speaker,
                        :lineNumber => lineNumber
                    })
                else
                    srtLine
                end
            true -> srtLine
        end
    end

    def addSpeakerToSrtLine(srtLine, transcriptLineInfo) do

        needle = srtLine
        |> Map.fetch!(:l1)
        |> Nlp.canonicalize
        |> String.downcase

        case {srtLine, transcriptLineInfo |> length} do
           {%{:l2 => "J'étais dans la pièce avec les cadeaux."}, 1} ->
                needle |> IO.inspect
                transcriptLineInfo |> IO.inspect
            _ ->
        end

        matchingTLIs = transcriptLineInfo
        |> Enum.filter(fn {%{:line => hay} , _} ->
            hay = hay |> Nlp.canonicalize
            n = needle
            needleRegex = "(^" <> n <> ")|(" <> n <> "$)|(\ " <> n <> "\ )"
            |> Regex.compile!
            (String.length(needle) > 0)
            && Regex.match?(needleRegex, hay)
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

    def addPreviousLineNumber(p) do
        case p do
            [] -> []
            [h = %{:lineNumber => l} | r] -> [h | addPreviousLineNumber(r, l)]
            [h | r] -> [h | addPreviousLineNumber(r)]
        end
    end

    def addPreviousLineNumber(arr, l) do
       case arr do
           [] -> []
           [h = %{:lineNumber => l} | r] -> [h | addPreviousLineNumber(r, l)]
           [h | r] -> [h |> Map.merge(%{:prevLineNumber => l}) | addPreviousLineNumber(r, l)]
       end
    end

    def addNextLineNumber(p) do
        case p do
            [] -> []
            [h = %{:lineNumber => l} | r] -> [h | addNextLineNumber(r, l)]
            [h | r] -> [h | addNextLineNumber(r)]
        end
    end

    def addNextLineNumber(arr, l) do
       case arr do
           [] -> []
           [h = %{:lineNumber => l} | r] -> [h | addNextLineNumber(r, l)]
           [h | r] -> [h |> Map.merge(%{:nextLineNumber => l}) | addNextLineNumber(r, l)]
       end
    end

    def sliceTranscriptLineInfoOnLineNumber(transcriptLineInfo, s, e) do
        transcriptLineInfo
        |> Enum.filter(fn {_, l} -> s <= l && l <= e end)
    end

    def numEntriesWithHasKey(arr, k) do
        arr
        |> Enum.filter(fn m -> m |> Map.has_key?(k) end)
        |> length
    end

    def addSurroundingLineNumbers(arr) do
        arr
        |> addPreviousLineNumber
        |> Enum.reverse
        |> addNextLineNumber
        |> Enum.reverse
    end

    def addSpeakerToSrtPairs(p, transcriptLineInfo) do
        p
        |> Enum.map(fn x -> x |> Srt.addSpeakerToSrtLine(transcriptLineInfo) end)
        |> Srt.lisOnLineNumber
        |> Util.onTheSide(fn x -> x |> numEntriesWithHasKey(:lineNumber) |> IO.inspect end)
        |> addSurroundingLineNumbers
        |> Enum.map(fn
            x = %{:lineNumber => _} -> x
            x = %{:prevLineNumber => s, :nextLineNumber => e} ->
                x
                |> Srt.addSpeakerToSrtLine(transcriptLineInfo
                |> sliceTranscriptLineInfoOnLineNumber(s, e))
            # todo: only prev, or only next
            x -> x
        end)
        |> Srt.lisOnLineNumber
        |> Util.onTheSide(fn x -> x |> numEntriesWithHasKey(:lineNumber) |> IO.inspect end)
        |> addSurroundingLineNumbers
        |> Util.onTheSide(fn x -> x |> numEntriesWithHasKey(:lineNumber) |> IO.inspect end)
        |> Enum.map(fn
            x = %{:lineNumber => _} -> x
            x = %{:prevLineNumber => s, :nextLineNumber => e} ->
                x
                |> Srt.heuristicAddSpeakerToSrtLine(transcriptLineInfo
                    |> sliceTranscriptLineInfoOnLineNumber(s, e))
            x -> x
        end)
        |> Srt.lisOnLineNumber
        |> Util.onTheSide(fn x -> x |> numEntriesWithHasKey(:lineNumber) |> IO.inspect end)
        |> addSurroundingLineNumbers
        |> Enum.map(fn
            x = %{:lineNumber => _} -> x
            x = %{:l1 => l1, :prevLineNumber => s, :nextLineNumber => e} ->
                tlis = sliceTranscriptLineInfoOnLineNumber(transcriptLineInfo, s, e)
                {l1, tlis} |> IO.inspect
                x
            x -> x
        end)
    end

    def pairSrt(l1Filename, l2Filename, transcriptFilename) do
        l1 = l1Filename |> parseSrt
        l2 = l2Filename |> parseSrt

        transcriptLineInfo = transcriptFilename
        |> parseTranscriptForLines

        l1
        |> Enum.map(fn e -> pairEntry(e, l2) end)
        |> Enum.filter(fn %{:score => score} -> score > 0.5 end)
        |> Enum.flat_map(fn p -> splitSrtPairsSentences(p) end)
        |> addSpeakerToSrtPairs(transcriptLineInfo)
        |> Enum.map(fn
            %{ :l1 => a, :l2 => b, :speaker => s, :lineNumber => l} -> {a |> Nlp.invertEllipses, b |> Nlp.invertEllipses, s, l}
            %{ :l1 => a, :l2 => b} -> {a |> Nlp.invertEllipses, b |> Nlp.invertEllipses}
        end)

    end

    def splitIntoSentences(p) do
        p
        |> String.split(~r/(?<=(\!|\?|\.))\ *(?=.)/u)
        |> Enum.flat_map(fn p -> p |> String.split(~r/(?<=\/ELLIPSES\/)(?=.)/) end)
    end

    def splitSrtPairsSentences(p) do
        %{:l1 => l1, :l2 => l2} = p

        l1Lines = l1 |> splitIntoSentences
        l2Lines = l2 |> splitIntoSentences

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
            |> String.replace(~r/\[UNCUT\]/, "")
            |> String.replace(~r/\.\.\./u, "/ELLIPSES/")
            |> String.replace(~r/\.\./u, "/ELLIPSES/")
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
