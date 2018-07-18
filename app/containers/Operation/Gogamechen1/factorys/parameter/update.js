import React from 'react';
import PropTypes from 'prop-types';


/* material-ui 引用部分  */
import TextField from 'material-ui/TextField';

/* 私人代码引用部分 */
import { isPint } from '../../../utils/math';

class UpdateAreas extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      areaname: '',
      showId: '',
    };
  }

  output = () => {
    const { handleParameter } = this.props;
    handleParameter(this.state.showId, this.state.areaname);
  };

  render() {
    const { showId, areaname } = this.props;
    return (
      <div style={{ marginLeft: '10%' }}>
        <TextField
          value={this.state.showId}
          floatingLabelText={`原区服显示ID: ${showId}`}
          hintText="更改区服显示ID"
          style={{ width: '250px' }}
          fullWidth={false}
          onChange={(event, value) => {
            if (isPint(value) || value === '') this.setState({ showId: value }, () => this.output());
          }}
        />
        <TextField
          floatingLabelText={`原区服名: ${areaname}`}
          value={this.state.areaname}
          hintText="更改区服名称"
          style={{ width: '250px' }}
          fullWidth={false}
          onChange={(event, value) => this.setState({ areaname: value }, () => this.output())}
        />
      </div>
    );
  }
}

UpdateAreas.propTypes = {
  showId: PropTypes.string,
  areaname: PropTypes.string,
  handleParameter: PropTypes.func,
};


export default UpdateAreas;
