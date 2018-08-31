import React from 'react'

class TrendingRow extends React.Component {
    render() {
      const data = this.props.data
      const key = data.key
      const count = data.doc_count
      
      return (
        <tr>
          <td>{key}
            <tr> <span style={{color: 'grey'}}> {count} searches</span> </tr>
          </td>
        </tr>
      );
    }
  }
  
class TrendingSearch extends React.Component {

  search = query => {
    const {submit, updateQuery} = this.props
    updateQuery(query)
    submit(query)
  }

  render() {
    const trendingData = {"data":[{"key":"GHRSST","doc_count":4},{"key":"viirs","doc_count":3},{"key":"satellite","doc_count":2}]}
    // const data = this.props.data
    const data = trendingData.data
    
    rows = []
    
    data.map((term) => {
      if (rows.length != 10) {        // TODO move the number out to a configuration file to display a max number of search terms
        rows.push(<TrendingRow data={term} />)
      }
    });
              
    return (
      <table>
        <thread>
          <tr>
            <th>Search Term</th>
          </tr>
        </thread>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default TrendingSearch
  

// I'll probably need this for using the search when clicking
// ----------------------------------------------------------
  

// Test data
// ---------
// const trendingData = {"data":[{"key":"GHRSST","doc_count":4},{"key":"viirs","doc_count":3},{"key":"satellite","doc_count":2}]}
