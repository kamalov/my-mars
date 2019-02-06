import React, {Component} from 'react';
import {TouchableWithoutFeedback, SafeAreaView, StyleSheet} from 'react-native';
import {CachedImage} from 'react-native-cached-image';

class ImageView extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleLayout = (e) => {
        const {width, height} = e.nativeEvent.layout;
        this.setState({componentSize: {width, height}});
    };

    handleNavigateBack = () => {
        this.props.navigation.goBack();
    };

    renderImage() {
        const {componentSize} = this.state;

        if (!componentSize) {
            return null;
        }

        const {width, height} = componentSize;
        const photo = this.props.navigation.getParam('photo');

        return (
            <TouchableWithoutFeedback onPress={this.handleNavigateBack}>
                <CachedImage
                    source={{uri: photo.uri}}
                    style={[
                        styles.image,
                        {width, height}
                    ]}
                    resizeMode={'contain'}
                />
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} onLayout={this.handleLayout}>
                {this.renderImage()}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    image: {
        backgroundColor: 'black'
    }
});

export {ImageView};
