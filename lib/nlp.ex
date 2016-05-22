defmodule Nlp do
    def stripPunctuation(str) do
        if str == nil do
            nil
        else
            str
            |> String.downcase
            |> String.replace(~r/[^a-z\ ]/, "")
        end
    end
end
