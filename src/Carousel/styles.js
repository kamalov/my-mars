import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {REGULAR_FONT, MEDIUM_FONT, MARGIN, BUTTON_RADIUS, ACTIVE_COLOR, BORDER_RADIUS} from '../consts';

const styles = StyleSheet.create({
    debug: {
        borderColor: 'red',
        borderWidth: 1
    },
    flex1: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardsCount: {
        position: 'absolute',
        marginBottom: 16,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardsCountText: {
        lineHeight: 20,
        fontSize: 14,
        fontFamily: REGULAR_FONT
    },
});

const menuStyles = StyleSheet.create({
    menu: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 56
    },
    undoButton: {
        position: 'absolute',
        left: 8,
        top: 8,
        width: 60,
        height: 40,
    },
    undoText: {
        marginLeft: 8,
        marginTop: 11,
        fontFamily: MEDIUM_FONT,
        fontSize: 16,
        lineHeight: 20
    },
    caption: {
        top: 16,
        color: 'black',
        fontFamily: MEDIUM_FONT,
        fontSize: 18,
        lineHeight: 24
    },
    heartButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 4,
        right: 4,
        width: 48,
        height: 48
    }
});

const buttonsStyles = StyleSheet.create({
    button: {
        position: 'absolute',
        zIndex: 100,
        width: BUTTON_RADIUS * 2,
        height: BUTTON_RADIUS * 2,
        borderRadius: BUTTON_RADIUS,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 24
    },
    buttonIcon: {
        position: 'absolute',
        zIndex: 200,
        elevation: 24
    },

    thumbsUpAnimatedView: {
        right: 70,
        bottom: 24,
        backgroundColor: ACTIVE_COLOR
    },
    thumbsUpIcon: {
        bottom: 43,
        right: 86,
    },
    thumbsUpButton:                     {
        position: 'absolute',
        zIndex: 200,
        width: BUTTON_RADIUS * 2,
        height: BUTTON_RADIUS * 2,
        right: 70,
        bottom: 24,
    },

    thumbsDownAnimatedView: {
        left: 70,
        bottom: 24,
        backgroundColor: 'black'
    },
    thumbsDownIcon: {
        bottom: 39,
        left: 87,
    },
    thumbsDownButton: {
        position: 'absolute',
        zIndex: 200,
        width: BUTTON_RADIUS * 2,
        height: BUTTON_RADIUS * 2,
        left: 70,
        bottom: 24,
    }
});

const cardsStyles = StyleSheet.create({
    card: {
        position: 'absolute',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    image: {
        borderRadius: BORDER_RADIUS
    },
    topBorder: {
        position: 'absolute',
        top: 0,
        height: 0.8,
        backgroundColor: 'black'
    },
    gradient: {
        position: 'absolute',
        top: 0,
        borderRadius: BORDER_RADIUS
    },
    textView: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    roverNameText: {
        position: 'absolute',
        left: 24,
        top: 24,
        lineHeight: 28,
        fontSize: 20,
        fontWeight: '500',
        fontFamily: REGULAR_FONT,
        color: 'white'
    },
    cameraNameText: {
        position: 'absolute',
        left: 24,
        top: 56,
        lineHeight: 20,
        fontSize: 14,
        fontFamily: REGULAR_FONT,
        color: 'white'
    },
    dateText: {
        position: 'absolute',
        left: 24,
        top: 76,
        lineHeight: 20,
        fontSize: 14,
        fontFamily: REGULAR_FONT,
        color: 'white'
    }
});

const shadowColor = "#102027";
const shadowsStyles = StyleSheet.create({
    elevate24: {
        ...Platform.select({
            android: {
                elevation: 24
            },
            ios: {
                shadowColor: shadowColor,
                shadowOffset: {
                    width: 0,
                    height: 16,
                },
                shadowOpacity: 0.16,
                shadowRadius: 24
            }
        }),
    },
    elevate20: {
        ...Platform.select({
            android: {
                elevation: 20
            },
            ios: {
                shadowColor: shadowColor,
                shadowOffset: {
                    width: 0,
                    height: 12,
                },
                shadowOpacity: 0.12,
                shadowRadius: 20
            }
        }),
    },
    elevate16: {
        ...Platform.select({
            android: {
                elevation: 16
            },
            ios: {
                shadowColor: shadowColor,
                shadowOffset: {
                    width: 0,
                    height: 8,
                },
                shadowOpacity: 0.08,
                shadowRadius: 16
            }
        }),
    },
    elevate10: {
        ...Platform.select({
            android: {
                elevation: 10
            },
            ios: {
                shadowColor: shadowColor,
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.04,
                shadowRadius: 12
            }
        }),
    },
});

export {styles, cardsStyles, shadowsStyles, buttonsStyles, menuStyles}
