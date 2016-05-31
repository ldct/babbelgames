defmodule Util do
    def indexIn(element, collection) do
        collection
        |> Enum.find_index(fn e -> e == element end)
    end

    def list_contains?(arr, elem) do
        indexIn(elem, arr) != nil
    end

    def argmaxAndMax(arr) do
        m = Enum.max(arr)
        {indexIn(m, arr), m}
    end

    def onTheSide(x, f) do
        f.(x)
        x
    end

    def fractionTrue(arr) do
        (arr |> Enum.filter(fn x -> x end) |> length) / (arr |> length)
    end

    def isMajority(arr) do
        fractionTrue(arr) > 0.5
    end
end
