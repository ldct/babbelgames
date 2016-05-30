defmodule Util do
    def indexIn(element, collection) do
        collection
        |> Enum.find_index(fn e -> e == element end)
    end

    def argmaxAndMax(arr) do
        m = Enum.max(arr)
        {indexIn(m, arr), m}
    end

    def onTheSide(x, f) do
        f.(x)
        x
    end
end
