import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import UploadProduct from "../components/admin/UploadProduct"

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Meta from "../components/meta/Meta";
import ViewOrders from "../components/admin/ViewOrders";
import ViewInquiries from "../components/admin/ViewInquiries";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Admin = () => {
	const router = useRouter()
	const profile = useSelector((state) => state.session.profile)
	const isAdmin = !profile.isEmpty && profile.isAdmin

	useEffect(() => {
		if (profile.isLoaded && !isAdmin) router.replace(profile.isEmpty ? '/login' : '/')
	}, [profile.isLoaded, isAdmin])

	// The API also rejects non-admins; this just keeps the page hidden from them.
	if (!isAdmin) return null

	return (
		<Flex
			width={'full'}
			minHeight={'60vh'}
			paddingX={{ base: 4, lg: 12 }}
			paddingY={8}
			flexDirection={'column'}>
			<Meta title={'Admin | Cebu Urban Interiors'}/>
			<ToastContainer />

			<Text
				fontWeight={'bold'}
				fontSize={'xl'}
				textColor={'black'}
				mb={3}>
				Admin
			</Text>

			<Tabs variant='enclosed' isFitted>
				<TabList>
					<Tab>Upload Product</Tab>
					<Tab>Orders</Tab>
					<Tab>Inquiries</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<UploadProduct />
					</TabPanel>
					<TabPanel>
						<ViewOrders />
					</TabPanel>
					<TabPanel>
						<ViewInquiries />
					</TabPanel>
				</TabPanels>
			</Tabs>

		</Flex>
	)
}

export default Admin