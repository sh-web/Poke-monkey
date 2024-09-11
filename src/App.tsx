import React, { useState, useEffect } from "react";

interface Pokemon {
  name: string;
  url: string;
}
interface Details {
  name: string;
  id: number;
  img: string;
}
function fetchHome() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [details, setDetails] = useState<Details[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  let limit = 20;
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
          };
        })
      );

      setDetails(detailsData);
    };
    if (urls.length > 0) {
      fetchDetails();
    }
  }, [pokemons]);

  return (
    <>
      <h1>モンスターブック</h1>
      {details.map((detail) => (
        <div className="cardstyle" key={detail.id}>
          <img src={detail.img} />
          <p>
            図鑑No.{detail.id}:{detail.name}
          </p>
        </div>
      ))}
    </>
  );
}
export default fetchHome;
