defmodule Nlp do
    def canonicalize(str) do
        if str == nil do
            nil
        else
            str
            |> String.downcase
            |> String.replace(~r/[^a-z\ ]/, "")
            |> String.replace(~r/^\ +/u, "")
            |> String.replace(~r/\ +/u, " ")
        end
    end

    def removeParens(str) do
        str |> String.replace(~r/\(.*\)/suU, "")
        |> String.replace(~r/\<.*\)/suU, "")
    end
end
