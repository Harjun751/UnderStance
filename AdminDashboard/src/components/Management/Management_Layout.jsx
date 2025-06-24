import Layout from "../general/Layout"

const Management_Layout = ({children, title}) => {
    return (
        <Layout title={title}>
            {children}
        </Layout>
    )
}

export default Management_Layout;