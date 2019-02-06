import moment from 'moment';
import React, {Component} from 'react';
import {ActivityIndicator, Text, View, Animated, PanResponder, TouchableOpacity, SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {CachedImage, ImageCacheManager} from 'react-native-cached-image';
import {CustomButton} from '../CustomButton';
import {BORDER_RADIUS, ACTIVE_COLOR, INACTIVE_COLOR} from '../consts';
import {ThumbsUpIcon, ThumbsDownIcon, EmptyHearthIcon} from '../icons';
import {getCardLayout, getCardTransformParams} from './cardUtils';
import {styles, cardsStyles, shadowsStyles, buttonsStyles, menuStyles} from './styles';
import {testData} from './testData';

class Carousel extends Component {

    constructor(props) {
        super(props);
        this.pan = new Animated.ValueXY({x: 0, y: 0});
        this.carouselAnimation = new Animated.Value(0);
        this.buttonsAnimation = new Animated.Value(0);
        this.state = {photos: null, viewedPhotos: []};
        this.initPanResponder();
    }

    componentDidMount() {
        this.loadPhotos();
    }

    async loadPhotos() {
        let photosData;
        try {
            const url = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=100&camera=NAVCAM&page=1&api_key=5VWlU1rBBPbEsvdXiIdZ3qXhvctciTSfnP5izcV4';
            const response = await fetch(url);
            photosData = await response.json();
        } catch (_) {
            photosData = testData;
        }

        const photos = photosData.photos.map(({img_src, rover, camera, earth_date}) => ({
                uri: img_src,
                rover: rover.name,
                camera: camera.full_name,
                date: earth_date
            })
        );
        photos.shift();
        photos.shift();

        const imageCacheManager = ImageCacheManager();
        const imagesToCache = photos.map(_ => imageCacheManager.downloadAndCacheUrl(_.uri));
        await Promise.all(imagesToCache);

        this.setState({photos});
    }

    updateLayout(width, height) {
        const componentSize = {width, height};

        this.completeAndResetAnimations();
        this.updateAnimations(componentSize);

        this.setState({
            componentSize,
            topCardLayout: getCardLayout(componentSize, 0),
        }, this.resetButtonsAnimation);
    }

    /// animations

    initPanResponder() {
        this.panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: () => {
                const {photos} = this.state;
                if (!photos || !photos.length) {
                    return;
                }
                this.completeAndResetAnimations();
            },

            onPanResponderMove: (_, {dx}) => {
                const {photos} = this.state;
                if (!photos || !photos.length) {
                    return;
                }
                this.pan.x.setValue(dx)
            },

            onPanResponderRelease: (_, {dx, vx}) => {
                const {photos, componentSize} = this.state;

                if (!photos || !photos.length) {
                    return;
                }

                const swiped = Math.abs(vx) > 0.8;
                const movedFarEnough = Math.abs(dx) > componentSize.width / 2;

                if (swiped || movedFarEnough) {
                    const direction = swiped ? vx : dx;
                    const status = direction > 0 ? 'like' : 'dislike';
                    this.processCurrentCard(status, 100);
                } else {
                    Animated.timing(this.pan, {
                        useNativeDriver: true,
                        toValue: {x: 0, y: 0},
                        duration: 100
                    }).start();
                }
            }
        })
    }

    updateAnimations(size) {
        const topCardLayout = getCardLayout(size, 0);
        const secondCardParams = getCardTransformParams(size, 1);
        const thirdCardParams = getCardTransformParams(size, 2);

        const topCardStyle = {
            ...topCardLayout,
            ...shadowsStyles.elevate24,
            transform: [
                {translateX: this.pan.x}
            ]
        };

        const secondCardStyle = {
            ...topCardLayout,
            ...shadowsStyles.elevate20,
            transform: [
                {scaleX: this.carouselAnimation.interpolate({inputRange: [0, 1], outputRange: [secondCardParams.scaleX, 1]})},
                {scaleY: this.carouselAnimation.interpolate({inputRange: [0, 1], outputRange: [secondCardParams.scaleY, 1]})},
                {translateY: this.carouselAnimation.interpolate({inputRange: [0, 1], outputRange: [-secondCardParams.translateY, 0]})}
            ]
        };

        const thirdCardStyle = {
            ...topCardLayout,
            ...shadowsStyles.elevate16,
            transform: [
                {scaleX: this.carouselAnimation.interpolate({inputRange: [0, 1], outputRange: [thirdCardParams.scaleX, secondCardParams.scaleX]})},
                {scaleY: this.carouselAnimation.interpolate({inputRange: [0, 1], outputRange: [thirdCardParams.scaleY, secondCardParams.scaleY]})},
                {translateY: this.carouselAnimation.interpolate({inputRange: [0, 1], outputRange: [-thirdCardParams.translateY, -secondCardParams.translateY]})}
            ]
        };

        const bottomCardStyle = {
            ...topCardLayout,
            ...shadowsStyles.elevate10,
            opacity: this.carouselAnimation.interpolate({inputRange: [0, 0.1], outputRange: [0, 1]}),
            transform: [
                {scaleX: thirdCardParams.scaleX},
                {scaleY: thirdCardParams.scaleY},
                {translateY: -thirdCardParams.translateY}
            ]
        };

        this.cardsAnimationStyles = [topCardStyle, secondCardStyle, thirdCardStyle, bottomCardStyle];
    }

    completeAndResetAnimations = () => {
        this.pan.stopAnimation();
        this.carouselAnimation.stopAnimation();
        this.pan.setValue({x: 0, y: 0});
        this.carouselAnimation.setValue(0);
    };

    resetButtonsAnimation = () => {
        const {componentSize, topCardLayout} = this.state;
        this.buttonsAnimation = this.pan.x.interpolate({
            inputRange: [
                -componentSize.width * 2, -componentSize.width, -topCardLayout.width / 2,
                topCardLayout.width / 2, componentSize.width, componentSize.width * 2
            ],
            outputRange: [0, -1, -1, 1, 1, 0]
        });
    };

    processCurrentCard = (status, animationDuration) => {
        const {componentSize, photos} = this.state;

        if (photos.length === 0) {
            return;
        }

        const outsideX = status === 'like' ? componentSize.width * 2 : -componentSize.width * 2;
        animationDuration = animationDuration || 200;

        Animated.parallel([
            Animated.timing(this.pan, {
                useNativeDriver: true,
                toValue: {x: outsideX, y: 0},
                duration: animationDuration
            }),
            Animated.timing(this.carouselAnimation, {
                useNativeDriver: true,
                toValue: 1,
                duration: animationDuration
            }),
        ]).start(() => this.processCardComplete(status));
    };

    processCardComplete = (status) => {
        const {photos, viewedPhotos} = this.state;
        const image = photos.shift();
        image.status = status;
        viewedPhotos.push(image);

        this.completeAndResetAnimations();
        this.setState({photos, viewedPhotos});
    };

    processUndo = () => {
        const {photos, viewedPhotos} = this.state;

        if (viewedPhotos.length === 0) {
            return;
        }

        this.completeAndResetAnimations();

        // not animating buttons on undo
        this.buttonsAnimation = new Animated.Value(0);

        const photo = viewedPhotos.pop();
        photos.unshift(photo);

        this.setState({photos, viewedPhotos}, this.animateUndo)
    };

    animateUndo = () => {
        const {componentSize, photos} = this.state;

        const x = photos[0].status === 'like' ? componentSize.width : -componentSize.width;
        this.pan.setValue({x, y: 0});
        this.carouselAnimation.setValue(1);

        Animated.parallel([
            Animated.timing(this.pan, {
                useNativeDriver: true,
                toValue: {x: 0, y: 0},
                duration: 200
            }),
            Animated.timing(this.carouselAnimation, {
                useNativeDriver: true,
                toValue: 0,
                duration: 200
            }),
        ]).start(this.undoComplete);
    };

    undoComplete = () => {
        this.completeAndResetAnimations();
        this.resetButtonsAnimation();
    };

    /// handlers

    handleLayout = (e) => {
        const {width, height} = e.nativeEvent.layout;
        this.updateLayout(width, height);
    };

    handleThumbsUp = () => {
        this.completeAndResetAnimations();
        this.processCurrentCard('like');
    };

    handleThumbsDown = () => {
        this.completeAndResetAnimations();
        this.processCurrentCard('dislike');
    };

    handleUndo = () => {
        this.processUndo();
    };

    handleGotoGallery = () => {
        const likedPhotos = this.state.viewedPhotos.filter(_ => _.status === 'like');
        this.props.navigation.navigate('Gallery', {likedPhotos});
    };

    handleImageLoad = (e, photo) => {
        const {width, height} = e.nativeEvent.source;
        photo.imageSize = {width, height};
    };

    /// render

    renderMenu() {
        const {viewedPhotos} = this.state;
        const canUndo = viewedPhotos.length > 0;
        const hasLikedPhotos = viewedPhotos.filter(_ => _.status === 'like').length > 0;

        return (
            <View style={menuStyles.menu}>
                <CustomButton
                    style={menuStyles.undoButton}
                    onPress={this.handleUndo}
                    disabled={!canUndo}
                    rippleColor={ACTIVE_COLOR}
                >
                    <Text style={[menuStyles.undoText, {color: canUndo ? ACTIVE_COLOR : INACTIVE_COLOR}]}>
                        Undo
                    </Text>
                </CustomButton>

                <View>
                    <Text style={menuStyles.caption}>My Mars</Text>
                </View>

                <CustomButton
                    style={menuStyles.heartButton}
                    disabled={!hasLikedPhotos}
                    onPress={this.handleGotoGallery}
                    rippleColor={ACTIVE_COLOR}
                >
                    <EmptyHearthIcon color={hasLikedPhotos ? ACTIVE_COLOR : INACTIVE_COLOR}/>
                </CustomButton>
            </View>
        );
    }

    renderCarousel() {
        if (!this.state.componentSize) {
            return null;
        }

        return (
            <View style={styles.flex1}>
                {this.renderCards()}
                {this.renderButtons()}
                {this.renderCardsCount()}
            </View>
        );
    }

    renderCards() {
        const {photos, topCardLayout} = this.state;
        const {width, height} = topCardLayout;

        if (!photos) {
            return (
                <View style={[styles.loading]}>
                    <ActivityIndicator size={'large'} color={ACTIVE_COLOR}/>
                </View>
            );
        }

        const cards = [];
        for (let i = 3; i >= 0; i--) {
            const photo = photos[i];
            if (photo) {
                cards.push(
                    <Animated.View
                        key={'card' + photo.uri}
                        style={[cardsStyles.card, this.cardsAnimationStyles[i]]}
                    >
                        <CachedImage
                            style={[cardsStyles.image, {width, height}]}
                            source={{uri: photo.uri}}
                            onLoad={e => this.handleImageLoad(e, photo)}
                            resizeMode="cover"
                        />

                        <View
                            style={[
                                cardsStyles.topBorder,
                                {
                                    left: BORDER_RADIUS,
                                    width: width - BORDER_RADIUS * 2,
                                }
                            ]}

                        />

                        <LinearGradient
                            colors={['#000000CC', '#EB575700']}
                            style={[cardsStyles.gradient, {width, height}]}
                        />

                        <View style={cardsStyles.textView}>
                            {this.renderCardText(photo)}
                        </View>
                    </Animated.View>
                )
            }
        }

        return cards;
    }

    renderCardText(photo) {
        const {rover, camera, date} = photo;
        return (
            <View>
                <Text style={cardsStyles.roverNameText}>
                    {rover}
                </Text>

                <Text style={cardsStyles.cameraNameText}>
                    {camera}
                </Text>

                <Text style={cardsStyles.dateText}>
                    {moment(date).format('MMMM DD, YYYY')}
                </Text>
            </View>
        )
    }

    renderButtons() {
        const {photos} = this.state;

        if (!photos || !photos.length) {
            return null;
        }

        const scale = 72 / 56;

        return [
            <Animated.View
                key="thumbsDownAnimatedView"
                style={[
                    buttonsStyles.button,
                    buttonsStyles.thumbsDownAnimatedView,
                    {
                        opacity: this.buttonsAnimation.interpolate({inputRange: [0, 1], outputRange: [1, 0.2]}),
                        transform: [
                            {scale: this.buttonsAnimation.interpolate({inputRange: [-1, 0], outputRange: [scale, 1], extrapolate: 'clamp'})}
                        ]
                    }
                ]}
            />,
            <View
                key="thumbsDownIcon"
                style={[buttonsStyles.buttonIcon, buttonsStyles.thumbsDownIcon]}
            >
                <ThumbsDownIcon/>
            </View>,
            <TouchableOpacity
                key="thumbsDownButton"
                style={buttonsStyles.thumbsDownButton}
                onPress={this.handleThumbsDown}
            />,
            <Animated.View
                key="thumbsUpAnimatedView"
                style={[
                    buttonsStyles.button,
                    buttonsStyles.thumbsUpAnimatedView,
                    {
                        opacity: this.buttonsAnimation.interpolate({inputRange: [-1, 0], outputRange: [0.2, 1]}),
                        transform: [
                            {scale: this.buttonsAnimation.interpolate({inputRange: [0, 1], outputRange: [1, scale], extrapolate: 'clamp'})}
                        ]
                    }
                ]}
            />,
            <View
                key="thumbsUpIcon"
                style={[buttonsStyles.buttonIcon, buttonsStyles.thumbsUpIcon]}
            >
                <ThumbsUpIcon/>
            </View>,
            <TouchableOpacity
                key="thumbsUpButton"
                style={buttonsStyles.thumbsUpButton}
                onPress={this.handleThumbsUp}
            />
        ]
    }

    renderCardsCount() {
        const {photos} = this.state;

        return (
            <View style={styles.cardsCount}>
                <Text style={styles.cardsCountText}>
                    {photos ? `${photos.length} cards` : 'Downloading'}
                </Text>
            </View>
        );
    }

    render() {
        console.log('render');
        console.log(this.state.componentSize);
        return (
            <SafeAreaView style={[styles.flex1]}>
                {this.renderMenu()}
                <View
                    style={styles.flex1}
                    onLayout={this.handleLayout}
                    {...this.panResponder.panHandlers}
                >
                    {this.renderCarousel()}
                </View>
            </SafeAreaView>
        );
    }
}

export {Carousel};
