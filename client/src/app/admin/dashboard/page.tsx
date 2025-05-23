'use client'

import AdminOffcanvas from "@/components/AdminOffCanvas"
import TodoAlert from "@/components/TodoAlert"
import { apiRoutes } from "@/constants/apiRoutes"
import { useGetList } from "@/hooks/useFetch"
import { AdminWallet } from "@/types/adminWallet"
import { ReactNode } from "react"
import { Spinner } from "@/components/Spinner" // Assume you have a Spinner component
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const AdminDashboard = () => {
    const { data: wallets, error: walletError, loading: walletLoading } = useGetList<AdminWallet>(apiRoutes.adminWallet.list())
    
    const todos: ReactNode[] = []
    if (!wallets.length) {
        todos.push(
            <TodoAlert 
                key="wallet-alert"
                message="You do not have any wallets, add wallets to start managing transactions" 
                link="/admin/wallets"
            />
        )
    }

    return (
        <AdminOffcanvas>
            <div className="bg-white rounded-2xl shadow-sm border-2 border-green-50 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-6 h-6 text-green-600" />
                    Admin Tasks
                </h2>

                {walletLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <Spinner className="w-8 h-8 text-green-600" />
                    </div>
                ) : walletError ? (
                    <div className="p-4 bg-red-50 rounded-lg border-2 border-red-100 text-red-700">
                        Error loading wallet information
                    </div>
                ) : (
                    <div className="space-y-4">
                        {todos.length > 0 ? (
                            <div className="grid gap-4">
                                {todos.map((todo, index) => (
                                    <div key={index}>{todo}</div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 bg-green-50 rounded-xl border-2 border-green-100 text-center">
                                <p className="text-green-700 font-medium">
                                    🎉 All caught up! No pending tasks
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminOffcanvas>
    )
}

export default AdminDashboard