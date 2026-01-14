'use client'
import React, { Fragment, useState } from 'react'
import Image from 'next/image'
import { InputFieldForm } from '../custom/InputField'
import { Form, FormField } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, User, UserRound } from 'lucide-react'
import { CustomButton } from '../custom/CustomButton'
import { Checkbox } from '../ui/checkbox'
import { CheckboxField } from '../custom/CheckboxField'
import Link from 'next/link'
import SplashScreen from '../custom/SplashScreen'

const PartnerAuthSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
    seSouvenirDeMoi: z.boolean(),
})

const defaultPartnerSchema = {
    username: '',
    password: '',
    seSouvenirDeMoi: false,
}

const PartnerAuth = () => {
    const form = useForm<z.infer<typeof PartnerAuthSchema>>({
        resolver: zodResolver(PartnerAuthSchema),
        mode: 'onBlur',
        defaultValues: {
            ...defaultPartnerSchema,
        },
    })
    const { handleSubmit, control } = form
    const [loading, setLoading] = useState(true)

    const onSignIn = (data: any) => {}

    const finishLoading = () => {
        setLoading(false)
    }
    return (
        <Fragment>
            {loading ? (
                <SplashScreen finishLoading={finishLoading} />
            ) : (
                <div className='flex min-h-screen w-full flex-col-reverse items-center justify-center lg:flex-row'>
                    <div className="flex h-auto w-full flex-col items-center justify-center bg-[url('/background-auth-partners.svg')] p-4 lg:min-h-screen lg:w-1/2 lg:p-0">
                        <div className='flex h-auto flex-col items-center justify-center gap-4 lg:justify-between lg:gap-7'>
                            <Image
                                className=''
                                src={'/logo-foodeals.svg'}
                                alt='Logo'
                                width={200}
                                height={200}
                            />
                            <Image
                                src={'/auth-partners.svg'}
                                alt='Partner Auth Image'
                                width={500}
                                height={500}
                                className='block w-80 lg:hidden'
                            />
                            <h1 className='font-base text-xl text-lynch-400'>
                                Administration
                            </h1>
                        </div>
                        <div>
                            <Form {...form}>
                                <form className='flex w-96 flex-col gap-6'>
                                    <InputFieldForm
                                        IconLeft={UserRound}
                                        control={control}
                                        name='username'
                                        type='text'
                                        placeholder='ID'
                                        label='Nom'
                                    />
                                    <InputFieldForm
                                        IconLeft={Lock}
                                        label='Mot de passe'
                                        control={control}
                                        name='password'
                                        type='password'
                                        placeholder='Password'
                                    />
                                    <div className='flex items-center justify-between'>
                                        <CheckboxField
                                            control={control}
                                            name='seSouvenirDeMoi'
                                            label='Se souvenir de moi'
                                        />
                                        <Link
                                            href='#'
                                            className='text-xs text-blue-500 hover:underline hover:underline-offset-1'
                                        >
                                            Mot de passe oublié ?
                                        </Link>
                                    </div>
                                    <CustomButton
                                        type='submit'
                                        IconRight={User}
                                        label='Se connecter'
                                        onClick={handleSubmit((data) =>
                                            onSignIn(data)
                                        )}
                                    />
                                </form>
                            </Form>
                        </div>
                    </div>
                    <div className='hidden min-h-full w-full flex-col items-center justify-center rounded-none bg-transparent lg:flex lg:min-h-screen lg:w-1/2 lg:rounded-l-3xl lg:bg-mountain-400'>
                        <Image
                            src={'/auth-partners.svg'}
                            alt='Partner Auth Image'
                            width={500}
                            height={500}
                        />
                    </div>
                </div>
            )}
        </Fragment>
    )
}

export default PartnerAuth
