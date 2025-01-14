import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import AppUser from '../../StaticData/AppUser';
const socket = io.connect("http://192.168.1.4:3001")

import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const Receivers = (props) => {

    const openChat = props.OpenChat
    const [messages, setMessages] = useState(props.Data)
    const [data, setData] = useState({ id: '', name: '', email: '', role: '' })

    const [text, setText] = useState('')

    const scrollViewRef = useRef();

    const send_Message = async (message) => {

        const app_user = new AppUser

        if (props.Role == 'Advisior') {
            const messageBody = {
                f_ID: props.Id,
                f_Name: props.Sender,
                a_ID: app_user.fetch().id,
                a_Name: app_user.fetch().name,
                s_TYPE: "professional",
                m_TEXT: text
            }

            const newMsg = {
                message: text,
                time: '',
                type: "professional"
            }

            setMessages([...messages, newMsg])
            scrollViewRef.current.scrollToEnd({ animated: true });
            await socket.emit("chat", messageBody)
        }

        if (props.Role == 'Farmer') {
            const messageBody = {
                f_ID: app_user.fetch().id,
                f_Name: app_user.fetch().name,
                a_ID: props.Id,
                a_Name: props.Sender,
                s_TYPE: "farmer",
                m_TEXT: text
            }

            const newMsg = {
                message: text,
                time: '',
                type: "farmer"
            }

            setMessages([...messages, newMsg])
            scrollViewRef.current.scrollToEnd({ animated: true });
            await socket.emit("chat", messageBody)
        }

    }

    useEffect(() => {
        const user = new AppUser
        setData(user.fetch())
    }, []);

    return (
        <View>
            <TouchableOpacity onPress={props.press_Action}>
                <View style={styles.button}>
                    <View style={styles.name}>
                        <Image style={styles.image} source={require('../../Assets/Icons/Account.png')} />
                        <Text style={styles.title}>{props.Sender}</Text>
                    </View>

                    <View style={styles.name}>
                        {!openChat && (
                            <Image style={styles.image} source={require('../../Assets/Icons/Expand.png')} />
                        )}

                        {openChat && (
                            <Image style={styles.image} source={require('../../Assets/Icons/CollapseH.png')} />
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {openChat && (
                <View style={styles.chatBox}>
                    <ScrollView ref={scrollViewRef} style={styles.scroller}>
                        {messages.map((msg, index) => (
                            <View key={index}>
                                {props.Role == 'Advisior' && (
                                    <View style={[msg.type == 'farmer' ? styles.f : styles.a]}>
                                        <View style={[styles.sender, msg.type == 'farmer' ? styles.farmer : styles.advisor]}>
                                            <Text style={styles.msg}>{msg.message}</Text>
                                        </View>
                                    </View>
                                )}

                                {props.Role == 'Farmer' && (
                                    <View style={[msg.type == 'farmer' ? styles.a : styles.f]}>
                                        <View style={[styles.sender, msg.type == 'farmer' ? styles.advisor : styles.farmer]}>
                                            <Text style={styles.msg}>{msg.message}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>

                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
                        <TextInput
                            style={styles.input}
                            multiline={true}
                            numberOfLines={1}
                            textAlignVertical="top"
                            paddingLeft={10}
                            scrollEnabled={true}
                            placeholder='Message'
                            placeholderTextColor={'grey'}
                            value={text}
                            onChangeText={(enter) => setText(enter)}     >
                        </TextInput>
                        <TouchableOpacity onPress={() => {
                            props.setReceiverId(props.Id)
                            props.show_PopUp()
                        }}>
                            <View style={{ borderStyle: 'solid', borderWidth: 2, height: 35, width: 35, borderRadius: 100, paddingTop: 2, paddingLeft: 2, marginLeft: 3, backgroundColor: '#D9D9D9' }}>
                                <Image style={{ height: 24, width: 23, alignSelf: "center" }} source={require('../../Assets/Icons/camera.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            props.setReceiverId(props.Id)
                            props.show_PopUp()
                        }}>
                            <View style={{ borderStyle: 'solid', borderWidth: 2, height: 35, width: 35, borderRadius: 100, paddingTop: 2, paddingLeft: 2, marginLeft: 3, backgroundColor: '#D9D9D9' }}>
                                <Image style={{ height: 24, width: 23, alignSelf: "center" }} source={require('../../Assets/Icons/image.png')} />
                            </View>
                        </TouchableOpacity>
                        {data.role == "Farmer" && <>
                            <TouchableOpacity onPress={() => {
                                props.setReceiverId(props.Id)
                                props.show_PopUp()
                            }}>
                                <View style={{ borderStyle: 'solid', borderWidth: 2, height: 35, width: 35, borderRadius: 100, paddingTop: 2, paddingLeft: 2, marginLeft: 3, backgroundColor: '#D9D9D9' }}>
                                    <Image style={{ height: 23, width: 25 }} source={require('../../Assets/Icons/star.png')} />
                                </View>
                            </TouchableOpacity>
                        </>}
                        <TouchableOpacity onPress={send_Message}>
                            <View style={{ borderStyle: 'solid', borderWidth: 2, height: 35, width: 35, borderRadius: 100, paddingTop: 2, paddingLeft: 2, marginLeft: 3, backgroundColor: '#D9D9D9' }}>
                                <Image style={{ height: 25, width: 25 }} source={require('../../Assets/Icons/Send.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({

    button: {
        marginHorizontal: 6,
        marginVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 38,
    },

    input: {
        width: '60%',
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 20,
        color: 'black',
        height: 35,
        fontStyle: 'italic',
        fontSize: 15,
        backgroundColor: '#D9D9D9'
    },

    title: {
        marginLeft: 6,
        color: 'black',
        fontWeight: 700,
        fontSize: 16
    },

    name: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    image: {
        height: 20,
        width: 20
    },

    notification: {
        height: 20,
        width: 20,
        borderRadius: 30,
        backgroundColor: '#005F41',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },

    chatBox: {
        marginTop: -7,
        height: 300,
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderTopWidth: 0,
        marginHorizontal: 6,
    },

    msg: {
        color: 'white',
        fontSize: 16,

    },

    scroller: {
        overflow: 'scroll',
    },

    sender: {
        maxWidth: 220,
        paddingHorizontal: 7,
        marginVertical: 6,
        paddingVertical: 6,
        borderRadius: 6
    },

    farmer: {
        backgroundColor: 'black',
    },

    advisor: {
        backgroundColor: 'grey'
    },

    f: {
        paddingLeft: 10,
        display: 'flex',
        alignItems: 'flex-start'
    },

    a: {
        paddingRight: 10,
        display: 'flex',
        alignItems: 'flex-end'
    }

})

export default Receivers;