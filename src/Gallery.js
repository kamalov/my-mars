import React, {Component} from 'react';
import {View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {CachedImage} from 'react-native-cached-image';
import {ACTIVE_COLOR} from './consts';
import {EmptyHearthIcon} from './icons';

class Gallery extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleLayout = (e) => {
        this.setState({componentWidth: e.nativeEvent.layout.width});
    };

    handleNavigateBack = () => {
        this.props.navigation.goBack();
    };

    handleImageView = (photo) => {
        this.props.navigation.navigate('ImageView', {photo});
    };

    renderGallery() {
        const {componentWidth} = this.state;

        if (!componentWidth) {
            return null;
        }

        const likedPhotos = this.props.navigation.getParam('likedPhotos');
        const minRowHeight = 130;
        const maxRowScale = (componentWidth - 4) / minRowHeight;

        let rowScale = 0;
        let rowImages = [];
        const rows = [];
        for (const photo of likedPhotos) {
            const {width, height} = photo.imageSize;
            const scale = width / height;
            if (rowScale + scale > maxRowScale) {
                rows.push({rowScale, rowImages});
                rowImages = [];
                rowScale = 0;
            }
            rowScale += scale;
            rowImages.push(photo);
        }
        rows.push({rowScale, rowImages});

        const views = rows.map((row, rowIndex) => {
            const {rowScale, rowImages} = row;
            const rowHeight = minRowHeight * maxRowScale / rowScale;
            const images = rowImages.map(photo => {
                const {imageSize, uri} = photo;
                const scale = imageSize.width / imageSize.height;
                const width = scale * rowHeight - 4;
                const height = rowHeight - 4;
                return (
                    <TouchableWithoutFeedback
                        key={`image ${rowIndex} ${uri}`}
                        onPress={() => this.handleImageView(photo)}
                    >
                        <View style={styles.galleryImage}>
                            <CachedImage source={{uri}} style={{width, height}}/>
                        </View>
                    </TouchableWithoutFeedback>
                );
            });

            return (
                <View
                    key={`row ${rowIndex}`}
                    style={{flexDirection: 'row'}}
                >
                    {images}
                </View>
            );
        });

        return (
            <ScrollView
                contentContainerStyle={styles.galleryContainer}
                showsVerticalScrollIndicator={false}
            >
                {views}
            </ScrollView>
        )
    }

    renderHeart() {
        return (
            <TouchableOpacity style={styles.heart} onPress={this.handleNavigateBack}>
                <EmptyHearthIcon color={ACTIVE_COLOR}/>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.gallery} onLayout={this.handleLayout}>
                    {this.renderGallery()}
                    {this.renderHeart()}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    gallery: {
        flex: 1,
        backgroundColor: 'black'
    },
    galleryContainer: {
        padding: 2,
        backgroundColor: 'black'
    },
    galleryImage: {
        margin: 2
    },
    heart: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 4,
        right: 4,
        width: 48,
        height: 48
    }
});

export {Gallery};
