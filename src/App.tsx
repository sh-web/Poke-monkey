import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./App.css";

interface Pokemon {
  name: string;
  url: string;
}
interface Details {
  name: string;
  id: number;
  img: string;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
}
type Filtering = {
  id: number;
  name: string;
  type: string;
};
function FetchHome() {
  const schema = z.object({
    name: z.string().min(1, "名前は必須です").or(z.literal("")),
    id: z
      .number()
      .min(1, "図鑑No.は1以上である必要があります")
      .or(z.number().max(151, "図鑑No.は151以下である必要があります"))
      .or(z.literal("")),
    type: z.string().min(1, "タイプは必須ではないです").or(z.literal("")),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Filtering>({ resolver: zodResolver(schema) });

  const onSubmit = (data: Filtering) => {
    setFilteredDetails(
      details.filter(
        (detail) =>
          (data.name === "" || detail.name.includes(data.name)) &&
          (String(data.id) === "" || detail.id === data.id) &&
          (data.type === "" || data.type === detail.types[0].type.name)
      )
    );
    console.log(filteredDetails);
    console.log(data);
  };
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [details, setDetails] = useState<Details[]>([]);
  const [filteredDetails, setFilteredDetails] = useState<Details[]>([]);
  const limit = 151;
  const urls = useMemo(() => {
    return pokemons.map((pokemon) => pokemon.url);
  }, [pokemons]);

  useEffect(() => {
    const fetchHomePokemon = async () => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
      );
      const data = await res.json();
      console.log(data.results);
      setPokemons(data.results);
    };
    fetchHomePokemon();
  }, []);
  useEffect(() => {
    const fetchDetails = async () => {
      const detailsData: Details[] = await Promise.all(
        urls.map(async (url) => {
          const res = await fetch(url);
          const data = await res.json();
          console.log(data);

          return {
            name: data.name,
            id: data.id,
            img: data.sprites.front_default,
            types: data.types,
          };
        })
      );

      setDetails(detailsData);
    };
    if (urls.length > 0) {
      fetchDetails();
    }
  }, [urls]);
  useEffect(() => {
    setFilteredDetails(details);
  }, [details]);

  return (
    <>
      <h1>モンスターブック</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>ポケモン名</label>

        <input id="name" {...register("name")} />

        <label>図鑑No.</label>
        <input id="id" type="number" {...register("id")} />
        {errors.name && <span>{errors.name.message}</span>}
        <label>タイプ</label>
        <select id="type" {...register("type")}>
          <option value="">タイプを選択してください</option>
          <option value="normal">ノーマル</option>
          <option value="fire">ほのお</option>
          <option value="water">みず</option>
          <option value="electric">でんき</option>
          <option value="grass">くさ</option>
          <option value="ice">こおり</option>
          <option value="fighting">かくとう</option>
          <option value="poison">どく</option>
          <option value="ground">じめん</option>
          <option value="flying">ひこう</option>
          <option value="psychic">エスパー</option>
          <option value="bug">むし</option>
          <option value="rock">いわ</option>
          <option value="ghost">ゴースト</option>
          <option value="dragon">ドラゴン</option>
          <option value="dark">あく</option>
          <option value="steel">はがね</option>
          <option value="fairy">フェアリー</option>
        </select>
        <button type="submit">フィルター</button>
      </form>
      <div className="cardcontainer">
        {filteredDetails.length === 0
          ? "条件に該当するポケモンが見つかりませんでした"
          : filteredDetails.map((detail) => (
              <div className="cardstyle" key={detail.id}>
                <p>
                  図鑑No.{detail.id}:{detail.name}
                </p>
                <img src={detail.img} />
                {detail.types.length === 1 && (
                  <p>タイプ:{detail.types[0].type.name}</p>
                )}
                {detail.types.length === 2 && (
                  <p>
                    タイプ:{detail.types[0].type.name}・
                    {detail.types[1].type.name}
                  </p>
                )}
              </div>
            ))}
      </div>
    </>
  );
}
export default FetchHome;
