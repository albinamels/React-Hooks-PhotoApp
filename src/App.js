import "./App.css";
import React, { useEffect, useState } from "react";
import { Spinner, Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { DebounceInput } from "react-debounce-input"; // npm i react-debounce-input
import { FcLike } from "react-icons/fc";
import { FaTwitter } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";

export const App = () => {
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    setPhotos(data);
  };

  useEffect(() => {
    const url = `https://api.unsplash.com/photos/?client_id=K1z7daCOfTevvq6JyTpQCEB3wXsdfC4N1d4H4WPWtxM&page=${page}`;

    setTimeout(() => {
      fetchData(url);
    }, 1000);
  }, [page]); // add dependency, re-fetch each time page changed

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredPhotos = photos.filter((photo) =>
    photo?.alt_description?.includes(searchQuery.toLowerCase())
  );

  const handleNextPage = () => setPage(page + 1);
  const handlePrevPage = () => setPage(page - 1);

  return (
    <div className="App">
      <div className="container bg-light p-3">
        <div className="row col-6 mb-3 mx-auto">
          <DebounceInput
            value={searchQuery}
            onChange={handleSearch}
            debounceTimeout={1500}
            minLength={3}
            style={{ padding: "10px" }}
          />
        </div>

        <div className="paginator">
          <Button
            color="secondary"
            onClick={handlePrevPage}
            disabled={page === 1 && true}
          >
            Prev
          </Button>
          <span className="curr-page">{page}/10</span>
          <Button
            color="secondary"
            onClick={handleNextPage}
            disabled={page === 10 && true}
          >
            Next
          </Button>
        </div>

        <div className="row">
          {photos.length ? (
            // on the initial load filteredPhotos = photos, searchQuery=''
            filteredPhotos.map((photo) => {
              return (
                <div className="col-lg-4 col-md-6 my-2" key={photo.id}>
                  <img src={photo.urls.small} />

                  {photo.description && <p>Description: {photo.description}</p>}

                  <div>Created by: {photo.user.name}</div>

                  {photo.user.social.twitter_username && (
                    <p>
                      <FaTwitter style={{ color: "rgb(15, 116, 233)" }} />{" "}
                      {photo.user.social.twitter_username}
                    </p>
                  )}

                  {photo.user.social.instagram_username && (
                    <p>
                      <BsInstagram style={{ color: "fuchsia" }} />{" "}
                      {photo.user.social.instagram_username}
                    </p>
                  )}

                  <div>
                    <FcLike /> {photo.likes}
                  </div>
                </div>
              );
            })
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
};
