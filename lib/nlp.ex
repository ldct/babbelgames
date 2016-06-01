defmodule Nlp do
    def canonicalize(str) do
        if str == nil do
            nil
        else
            str
            |> String.replace(~r/\.\.\./u, "\/ELLIPSES\/")
            |> String.replace(~r/\.\./u, "\/ELLIPSES\/")
            |> String.replace(~r/\/ELLIPSES\//u, " ")
            |> String.downcase
            |> String.replace("-", " ")
            |> expandShortForms
            |> String.replace(~r/[^a-z\ ]/u, "")
            |> String.replace(~r/^\ +/u, "")
            |> String.replace(~r/\ +$/u, "")
            |> String.replace(~r/\ +/u, " ")
        end
    end

    def removeParens(str) do
        str
        |> String.replace(~r/\(.*\)/suU, "")
        |> String.replace(~r/\<.*\>/suU, "")
        |> String.replace(~r/\[.*\]/suU, "")
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
        |> String.replace("outta", "out of")
        |> String.replace("cmere", "come here")
        |> String.replace("ya", "you")
        |> String.replace("alright", "all right")
        |> String.replace("how'd", "how did")
        |> String.replace("gimme", "give me")
        |> String.replace("goodnight", "good night")
        |> String.replace("whaddya", "what are you")
        |> String.replace("y'", "you ")
    end

end
