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

  end
end