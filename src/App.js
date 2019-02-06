import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {Carousel} from './Carousel/Carousel';
import {Gallery} from './Gallery';
import {ImageView} from './ImageView';

const AppNavigator = createStackNavigator(
    {
        Carousel: { screen: Carousel },
        Gallery: { screen: Gallery },
        ImageView: { screen: ImageView }
    },
    {
        initialRouteName: 'Carousel',
        headerMode: 'none'
    }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}
