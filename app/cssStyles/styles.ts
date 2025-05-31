import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    content: {
        width: "100%",
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 10,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#f8f4f4",
        borderRadius: 25,
        padding: 10,
        marginVertical: 10,
    },
    buttonContainer: {
        width: "100%",
        height: 50,
        backgroundColor: "#fc5c65",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    loginText: {
        color: "#fc5c65",
        textAlign: "center",
        marginVertical: 10,
    },
    reportsContainer: {
        width: '100%', 
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    report: {
        flexDirection: "row",
        //alignItems: "center",
    },
    reportText: {
        marginLeft: 10,
        fontSize: 18,
    },
    listContent: {
        paddingBottom: 24,
    },
    form: {
        width: "100%",
        padding: 20
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#2196F3',
        borderRadius: 28,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    fabText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cameraContainer: {
        flex: 1,
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
    },
});

export default styles;