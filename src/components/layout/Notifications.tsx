import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Bell } from 'lucide-react'
interface NotificationsProps {
    notificationData: string[]
}

const Notifications: React.FC<NotificationsProps> = ({ notificationData }) => {
    const [notifications, setNotifications] =
        React.useState<string[]>(notificationData)
    const onClearNotifications = () => {
        setNotifications([])
    }
    return (
        <Popover>
            <PopoverTrigger
                className='rounded-full p-2 text-lynch-400 lg:hidden'
                aria-label='Notifications'
            >
                <Bell size={30} />
            </PopoverTrigger>
            <PopoverContent className='rounded-lg bg-white p-4 shadow-lg'>
                <div className='mb-2 flex items-center justify-end'>
                    <button
                        onClick={onClearNotifications}
                        className='text-sm text-mountain-400 transition-all hover:underline'
                    >
                        Clear All
                    </button>
                </div>
                <div className='list-disc pl-5'>
                    {notifications.length === 0 ? (
                        <p className='text-gray-500'>
                            There are no notifications.
                        </p>
                    ) : (
                        <ul>
                            {notifications.map((notification, index) => (
                                <li key={index}>{notification}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default Notifications
