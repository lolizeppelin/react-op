import React from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


const stylesDefault = {
  dialog: {},
  title: { textAlign: 'center' },
};


const propsDefault = {
  open: false,
  payload: {
    title: '默认提交',
    styles: stylesDefault,
    data: '默认显示内容',
    onSubmit: null,
    diableSubmit: false,
    onCancel: null,
    diableCancel: false,
  },
};


function defaultProps(payload) {
  const formatedProps = {};
  if (payload === null) {
    return propsDefault.payload;
  }
  // return { ..propsDefault.payload, ..payload }
  formatedProps.title = payload.title || propsDefault.payload.title;
  formatedProps.styles = payload.styles || propsDefault.payload.styles;
  formatedProps.data = payload.data || propsDefault.payload.data;
  formatedProps.onSubmit = payload.onSubmit || propsDefault.payload.onSubmit;
  formatedProps.onCancel = payload.onCancel || propsDefault.payload.onCancel;
  formatedProps.diableSubmit = payload.diableSubmit || propsDefault.payload.diableSubmit;
  formatedProps.diableCancel = payload.diableCancel || propsDefault.payload.diableCancel;
  return formatedProps;
}


class SubmitDialogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {
      this.setState({
        open: nextProps.open,
      });
    }
  }

  render() {
    const { payload } = this.props;
    const formated = defaultProps(payload);
    const actions = [];
    if (formated.onCancel !== null) actions.push(<FlatButton primary label="取消" onClick={() => { formated.onCancel(); this.setState({ open: false }); }} disabled={formated.diableCancel} />);
    if (formated.onSubmit !== null) actions.push(<FlatButton secondary label="确定" onClick={() => { formated.onSubmit(); this.setState({ open: false }); }} disabled={formated.diableSubmit} />);
    if (actions.length === 0) {
      actions.push(<FlatButton label="OK" onClick={() => { this.setState({ open: false }); }} />);
    }

    return (
      <Dialog
        title={formated.title}
        style={formated.styles.dialog}
        titleStyle={formated.styles.title}
        actions={actions}
        modal={false}
        open={this.state.open}
      >
        {formated.data}
      </Dialog>
    );
  }
}

SubmitDialogs.defaultProps = propsDefault;


SubmitDialogs.propTypes = {
  open: PropTypes.bool,
  payload: PropTypes.object,
  // title: PropTypes.string,
  // styles: PropTypes.object,
  // data: PropTypes.any,
  // onSubmit: PropTypes.func,
  // onCancel: PropTypes.func,
};


export { SubmitDialogs };
