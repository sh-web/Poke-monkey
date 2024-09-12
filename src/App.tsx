import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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
function fetchHome() {
  const { register, handleSubmit } = useForm<Filtering>();
  const onSubmit = (data: Filtering) => {
    setFiltered_details(
      details.filter(
        (detail) =>
          (data.name === "" || detail.name.includes(data.name)) &&
          (String(data.id) === "" || detail.id === Number(data.id)) &&
          (data.type === "" || data.type === detail.types[0].type.name)
      )
    );
    console.log(filtered_details);
    console.log(data);
  };
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [details, setDetails] = useState<Details[]>([]);
  const [filtered_details, setFiltered_details] = useState<Details[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  let limit = 151;
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  let response = {};

  useEffect(() => {
    const fetchHomePokemon = async () => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await res.json();
      console.log(data.results);
      setPokemons(data.results);
    };
    fetchHomePokemon();
  }, [offset]);
  useEffect(() => {
    const urlsArray = pokemons.map((pokemon) => pokemon.url);
    setUrls(urlsArray);
    const fetchDetails = async () => {
      const detailsData: Details[] = await Promise.all(
        urlsArray.map(async (url) => {
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
    // if (details) {
    //   setFiltered_details(details);
    //   console.log(filtered_details);
    // }
  }, [pokemons]);
  useEffect(() => {
    setFiltered_details(details);
  }, [details]);

  return (
    <>
      <h1>モンスターブック</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>ポケモン名</label>

        <input id="name" {...register("name")} />

        <label>図鑑No.</label>
        <input id="id" {...register("id")} />
        <label>タイプ</label>
        <input id="type" {...register("type")} />
        <button type="submit">フィルター</button>
      </form>

      {filtered_details.map((detail) => (
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
              タイプ:{detail.types[0].type.name}・{detail.types[1].type.name}
            </p>
          )}
        </div>
      ))}
    </>
  );
}
export default fetchHome;
