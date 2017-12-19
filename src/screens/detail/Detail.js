import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView, Text, Image, View, TouchableOpacity, StatusBar } from 'react-native';
import get from 'lodash/get';

import v from 'styles/variables';
import g from 'styles/global';
import { capitalize, convertToHttps } from 'utils/utils';
import { colors } from 'utils/colors';
import { navigatorTypes } from 'utils/types';
import { icons } from 'Api';

import { Stats } from './components/Blocks';

export default class Detail extends Component {

  static propTypes = {
    ...navigatorTypes,
    network: PropTypes.string,
    data: PropTypes.object,
    history: PropTypes.object,
  }

  static navigatorStyle = {
    navBarHidden: true,
  }

  hitIcon = {
    top: 15,
    left: 15,
    bottom: 15,
    right: 15,
  }

  componentDidMount() {
    StatusBar.setHidden(true, 'fade');
  }

  componentWillUnmount() {
    StatusBar.setHidden(false, 'fade');
  }

  render() {
    const { network, data, history } = this.props;
    const { user } = data;

    const source = get(data, 'user.Avatar')
      ? { uri: convertToHttps(user.Avatar) }
      : require('../../assets/images/avatar-placeholder.png');

    return (
      <View style={s.detail}>
        <View style={[g.layout, s.detail__container]}>
          <View style={s.detail__header}>
            <TouchableOpacity
              onPress={this.hideModal}
              style={s.detail__arrow}
              hitSlop={this.hitIcon}
              activeOpacity={0.75}
            >
              <Image
                style={s.detail__icon}
                source={require('../../assets/images/arrow-bottom.png')}
              />
            </TouchableOpacity>

            <View style={s.detail__title}>
              <Image
                style={[s.detail__network, { tintColor: colors(network) }]}
                resizeMode="contain"
                source={this.getIcon(network)}
              />

              <Text
                style={[s.detail__name, { color: colors(network) }]}
              >
                {capitalize(network)}
              </Text>
            </View>
          </View>

          <ScrollView>
            <View style={s.detail__user}>
              <Image style={s.detail__useravatar} source={source} />

              {get(data, 'user.Name') && <Text style={s.detail__username}>{user.Name}</Text>}
              {get(data, 'user.Location') && <Text style={s.detail__usertext}>{user.Location}</Text>}
              {get(data, 'user.Bio') && <Text style={[s.detail__usertext, s.detail__userabout]}>{user.Bio}</Text>}
            </View>

            <Stats
              network={network}
              data={data.stats}
              history={history}
            />
          </ScrollView>
        </View>
      </View>
    );
  }

  getIcon = name => icons.find(n => n.name === name).icon;

  hideModal = () => {
    const { navigator } = this.props;

    navigator.dismissModal();
  }
}

const s = StyleSheet.create({
  detail: {
    flex: 1,

    backgroundColor: '#000',
  },

  detail__container: {
    overflow: 'hidden',

    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: v.bgBlue,
  },

  detail__header: {
    height: 64,

    shadowColor: 'rgb(23, 24, 26)',
    shadowOffset: { height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.04,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(225,235,245,0.80)',
    backgroundColor: '#fff',
  },

  detail__arrow: {
    position: 'absolute',
    top: 28,
    left: 22,

    backgroundColor: 'transparent',
  },

  detail__icon: {
    tintColor: '#CAD8E6',
  },

  detail__title: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignSelf: 'center',

    marginTop: 23,
  },

  detail__network: {
    marginRight: 5,

    width: 20,
    height: 20,
  },

  detail__name: {
    marginLeft: 4,

    fontFamily: v.dinBold,
    fontSize: 16,

    backgroundColor: 'transparent',
  },

  detail__user: {
    paddingVertical: 40,
  },

  detail__useravatar: {
    alignSelf: 'center',

    width: 64,
    height: 64,

    borderRadius: 32,
  },

  detail__username: {
    marginTop: 20,

    fontFamily: v.dinBold,
    fontSize: 18,
    color: v.dark,
    textAlign: 'center',

    backgroundColor: 'transparent',
  },

  detail__usertext: {
    marginTop: 6,
    paddingHorizontal: 40,

    fontFamily: v.din,
    fontSize: 16,
    color: v.lightBlue,
    textAlign: 'center',

    backgroundColor: 'transparent',
  },

  detail__userabout: {
    marginTop: 20,

    fontSize: 14,
    lineHeight: 22,
  },
});