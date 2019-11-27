import React from "react";
import Health from "./Health";
import Input from "./Input";
import Output from "./Output";
import { getWebsiteResults } from "./apiClient";

export default class App extends React.Component {
  state = {
    loading: false,
    results: undefined,
    err: undefined,
    prevSearch: "",
    prevSearchTime: 0
  };

  fetchResults = async website => {
    try {
      if ((this.state.prevSearch === website) && (Date.now() - this.state.prevSearchTime) < 15000) {
        alert("Warning: Scraping too quickly on the same website might cause problems. Please wait 15 seconds before trying again.");
      } else {
        this.setState({ prevSearch: website, prevSearchTime: Date.now() });
      }
      this.setState({ loading: true, results: undefined, err: undefined });
      const results = await getWebsiteResults(website);
      this.setState({ results: results });
    } catch (err) {
      this.setState({ err: err });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="mt-5 row">
          <div className="col-md-10">
            <h1>Hi! I'm RoboCat 🐱</h1>
            <p>
              <em>can you help find me some friends?</em>
            </p>
          </div>
          <div className="col-md-2">
            <Health />
          </div>
        </div>
        <div className="mb-3">
          <Input onSubmit={this.fetchResults} loading={this.state.loading} />
        </div>
        <Output results={this.state.results} err={this.state.err} />
      </div>
    );
  }
}
