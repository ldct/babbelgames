defmodule Srt do

    use Timex

    def parseSrt(filename) do
        filename
        |> File.read!
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
          'time': [start_time, end_time],
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