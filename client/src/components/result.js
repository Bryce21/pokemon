import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export default class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonStringified: null,
      movesSearch: ''
    };
  }

  async componentDidMount(){
    const data = (await axios.get(`${this.props.url}`)).data;
    this.setState({jsonStringified: JSON.stringify(data, null, 2)})
  }

  async componentDidUpdate(prevProps){
    if(this.props.url !== prevProps.url){
      const data = (await axios.get(`${this.props.url}`)).data;
      this.setState({jsonStringified: JSON.stringify(data, null, 2)})
    }
  }


  createUlWithUrls = (array, textField, urlField) => {
    const data =  array.map((item, index) => <li key={index}><a href={item[urlField]}>{item[textField]}</a></li>);
    return data;
  }

  parseJsonResult = () => {
    const jsonObj = JSON.parse(this.state.jsonStringified);
    return <div>
      <div>Abilities: </div>
      <ul>{jsonObj.abilities.map((item, index) => <li key={index}><a href={item.ability.url}>{item.ability.name}</a></li>)}</ul>
      <div>Base exp: {jsonObj.base_experience}</div>

      <div>Forms:</div>
      <ul>{this.createUlWithUrls(jsonObj.forms, 'name', 'url')}</ul>
      <div>Height: {jsonObj.height}</div>


      <div>Sprite(s):</div>
      <img src={jsonObj.sprites.front_default}/>
      <img src={jsonObj.sprites.back_default}/>
      <img src={jsonObj.sprites.front_shiny}/>
      <div className='tableWrapper'>
        {this.renderTableForMoves(jsonObj.moves)}
      </div>
    </div>
  };


  renderTableForMoves = (moves) => {
    const flattenedMoves = moves.map(move => ({name: move.move.name, url: move.move.url, moveInfo: move.version_group_details}));
    const tableData = flattenedMoves.map(moveObj => {
      return <tr>
        <th>{moveObj.name}</th>
        <th><a href={moveObj.url}>{moveObj.url}</a></th>
      </tr>
    });

    return <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Url</th>
        </tr>
      </thead>
      <tbody>
        {tableData}
      </tbody>

    </table>

  };

  render() {
    return (
      <div>
        <div>Name: {this.props.name}</div>
        <a href={this.props.url}>{this.props.url}</a>
        {!!this.state.jsonStringified && this.parseJsonResult()}
      </div>

    );
  }
}

Result.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string
};
