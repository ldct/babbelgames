defmodule Nlp do
    def canonicalize(str) do
        if str == nil do
            nil
        else
            str
            |> String.replace(~r/\/ELLIPSES\//, " ")
            |> String.downcase
            |> expandShortForms
            |> String.replace(~r/[^a-z\ ]/, "")
            |> String.replace(~r/^\ +/u, "")
            |> String.replace(~r/\ +$/u, "")
            |> String.replace(~r/\ +/u, " ")
        end
    end

    def removeParens(str) do
        str
        |> String.replace(~r/\(.*\)/suU, "")
        |> String.replace(~r/\<.*\)/suU, "")
    end

    def invertEllipses(str) do
        str |> String.replace("/ELLIPSES/", "...")
    end

    def expandShortForms(str) do
        str
        |> String.replace("d’", "do ")
        |> String.replace("gonna", "going to")
        |> String.replace("wanna", "want to")
        |> String.replace("’em", "them")
        |> String.replace("’til", "till")
        |> String.replace("dunno", "don't know")
        |> String.replace("gotta", "got to")
        |> String.replace("i'm", "i am")
        |> String.replace("there's", "there is")
        |> String.replace("what're", "what are")
        |> String.replace("c'mon", "come on")
        |> String.replace("there's", "there is")
    end

end
