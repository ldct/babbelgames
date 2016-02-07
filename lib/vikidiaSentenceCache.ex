defmodule VikidiaSentenceCache do
  def start_link do
    initial_state = allJsonContents()
    Agent.start_link(fn -> initial_state end, name: __MODULE__)
  end

  def get(f \\ &(&1)) do
    Agent.get(__MODULE__, f)
  end

  def jsonContentsOf(title) do
    File.read!("vikidia/translated/" <> title)
    |> Poison.decode!
  end

  def allJsonContents() do
    File.ls!("vikidia/translated")
    |> Enum.map(fn x -> jsonContentsOf(x) end)
    |> Enum.filter(fn x -> not isBadEntry(x) end)
    |> Enum.uniq(fn x -> x["original"] end)
  end

  def allSentences() do
    allJsonContents()
    |> Enum.map(fn x -> x["original"] end)
  end

  def isBadEntry(entry) do
    entry 
    |> Map.fetch!("original")
    |> isBadOriginal
  end

  def isBadOriginal(original) do
    containsBadSubstring(original) or 
    "." === original or
    not hasEst(original)
  end

  def hasEst(original) do
    String.contains?(original, " est ") or
    String.contains?(original, "C'est")
  end

  def containsBadSubstring(original) do
    [
      "Attention, à ne pas confondre",
      "Cette page d’homonymie liste",
      "Cet article est une ébauche"
    ]
    |> Enum.any?(fn badString -> String.contains?(original, badString) end)
  end



end