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
end
