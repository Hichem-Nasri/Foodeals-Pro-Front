import React, { FC, Fragment, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../ui/command'
import { ChevronDown, ListPlus, X, Map, MapPin } from 'lucide-react'
import { Switch } from '../ui/switch'
import { cn } from '@/lib/utils'
import { MultiSelectOptionsType, MultiSelect } from '../tools/MultiSelect'

interface DialogMultiProps {
    setValue: React.Dispatch<React.SetStateAction<string>>
    onChange: React.Dispatch<React.SetStateAction<string[]>>
    value: string[]
    transform?: ((value: MultiSelectOptionsType[]) => Element[]) | undefined
    disabled?: boolean
    placeholder?: string
}

type ZoneType = {
    name: string
    location: string[]
}

const getMultiSelectOption = (option: string) => {
    return {
        key: option,
        label: option,
    }
}

const DialogMulti: FC<DialogMultiProps> = ({
    setValue,
    onChange,
    value,
    transform,
    placeholder,
    disabled = false,
}) => {
    // const data: Record<string, string[]> = {
    //     CaseBlanca: [
    //         'ain diab',
    //         'anfa',
    //         'bouskoura',
    //         'bouskoura golf city',
    //         'californie',
    //         'casablanca',
    //         'centre ville',
    //         'dar bouazza',
    //         'gauthier',
    //         'hay hassani',
    //         'hay riad',
    //         'maarif',
    //         'mohammedia',
    //         'ouled saleh',
    //     ],
    //     rabat: [
    //         'agdal',
    //         'ain aouda',
    //         'ain el aouda',
    //         'akreuch',
    //         'al irfane',
    //         'al manal',
    //     ],
    //     fes: [
    //         'agdal',
    //         'ain aouda',
    //         'ain el aouda',
    //         'akreuch',
    //         'al irfane',
    //         'al manal',
    //     ],
    // }
    const [myData, setData] = useState<ZoneType[]>([])
    useEffect(() => {
        // const fetchCities = async () => {
        //     const cities = await getAllCities()
        //     const allregion: ZoneType[] = cities.map(
        //         async (value: MultiSelectOptionsType) => {
        //             const regions = await getRegions(value.id!)
        //             return {
        //                 name: value.label,
        //                 location: regions.map(
        //                     (region: MultiSelectOptionsType) => region.label
        //                 ),
        //             }
        //         }
        //     )
        //     const data = await Promise.all(allregion)
        //
        //     setData(data)
        // }
        // fetchCities()
    }, [])
    const [selectedCity, setSelectedCity] = useState<string[] | null>(() => {
        if (!value) return null
        return value.map((item) => item.split('-')[0])
    })
    const [selectedRegion, setSelectedRegion] = useState<string[]>(value)
    const [options, setOptions] = useState<MultiSelectOptionsType[]>([])
    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (!selectedCity) return
        const newOptions = myData
            .filter((value) => selectedCity.includes(value.name))
            .flatMap((city) =>
                city.location.map((region) => ({
                    key: city.name + '-' + region,
                    label: region,
                }))
            )
        setOptions(newOptions)
    }, [selectedCity])
    useEffect(() => {}, [options])
    return (
        <Popover>
            <PopoverTrigger
                className={`flex h-14 w-full items-center justify-between rounded-[12px] border-0 bg-lynch-50 px-3 text-lynch-400 hover:text-lynch-700 [&>icon]:text-lynch-200 hover:[&>icon]:text-lynch-500 ${
                    // options?.find((option) => option.key == value)?.label
                    value ? 'border-textGray' : ''
                } `}
                disabled={disabled}
            >
                {selectedRegion.length > 1 ? (
                    <span className='line-clamp-1 text-start text-base font-normal'>
                        {selectedRegion.length > 1 ? (
                            <Fragment>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger className='text-lynch-500 hover:text-lynch-700'>
                                        Plusieurs ville
                                    </DialogTrigger>
                                    <DialogContent
                                        showContent={false}
                                        className='left-[calc(100%-250px)] flex min-h-screen min-w-[500px] flex-col justify-start'
                                    >
                                        <div className='flex min-h-full w-full flex-col items-start justify-center space-y-6 px-5 py-3'>
                                            <div className='flex w-full items-center justify-between text-xl font-normal text-lynch-400'>
                                                <h4>List des Zones couverts</h4>
                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        setOpen((prev) => !prev)
                                                    }
                                                >
                                                    <X className='size-8' />
                                                </button>
                                            </div>
                                            <div className='flex flex-col items-start justify-center space-y-6'>
                                                {/* {valuesGetting(
                                                    selectedRegion!
                                                ).map((city, index) => {
                                                    return (
                                                        <div
                                                            key={
                                                                city.name +
                                                                index
                                                            }
                                                            className="self-start flex flex-col justify-center items-start space-y-4"
                                                        >
                                                            <h5 className="text-lynch-950 flex justify-center space-x-2">
                                                                <Map className="text-lynch-700" />
                                                                <span>
                                                                    {city.name}
                                                                </span>
                                                            </h5>
                                                            <div className="flex flex-wrap space-y-2 justify-start items-center gap-2 text-lynch-400">
                                                                {city.location.map(
                                                                    (
                                                                        region,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    region +
                                                                                    index
                                                                                }
                                                                                className=" self-end flex-grow-0 justify-center px-5 py-3 flex items-start space-x-2 bg-lynch-100 rounded-[12px] text-nowrap"
                                                                            >
                                                                                <MapPin />
                                                                                <span>
                                                                                    {region.trim()}
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })} */}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </Fragment>
                        ) : value ? (
                            value
                        ) : (
                            'Selectionne la zone'
                        )}
                    </span>
                ) : (
                    <div
                        className={`line-clamp-1 flex items-center text-start text-base font-normal`}
                    >
                        {(selectedRegion.length > 0 &&
                            selectedRegion[0].split('-').slice(1).join(' ')) ||
                            placeholder}
                    </div>
                )}
                {selectedRegion.length > 1 ? (
                    <ListPlus className='icon' />
                ) : (
                    <ChevronDown className='icon' />
                )}
            </PopoverTrigger>
            <PopoverContent className='rounded-[16px] p-3'>
                <Command className='flex flex-col space-y-2 p-0'>
                    <h3 className='font-base text-start text-sm'>
                        Sélectionner la zone Couverte
                    </h3>
                    <CommandInput
                        className='placeholder:text-input text-textGray mt-2 w-[80%] rounded-[12px] bg-lynch-50 text-base font-normal placeholder:text-base placeholder:font-normal'
                        placeholder={'ville...'}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading=''>
                            <MultiSelect
                                transform={(value) => {
                                    if (value.length > 1)
                                        return [<div key={1}>Multi</div>]
                                    return value.map((item, index) => {
                                        return (
                                            <div
                                                key={
                                                    item.key.toString() + index
                                                }
                                            >
                                                {item.label}
                                            </div>
                                        )
                                    })
                                }}
                                length={1}
                                region={true}
                                options={options}
                                disabled={options.length === 0 || disabled}
                                selectedValues={selectedRegion}
                                onSelect={(value: string[]) => {
                                    setSelectedRegion(value)
                                    onChange(value)
                                }}
                                placeholder={'Selectionne la zone'}
                            />
                        </CommandGroup>
                        <CommandGroup
                            heading='Résultat de la zone ou région'
                            className='font-base mt-4 text-sm text-lynch-500'
                        >
                            {/* list of city using switch ui*/}
                            {myData.map((city, index) => (
                                <CommandItem key={index}>
                                    <div
                                        className={cn(
                                            'flex h-12 w-full items-center justify-between space-x-2 px-2',
                                            `${
                                                selectedCity?.includes(
                                                    city.name
                                                ) &&
                                                'w-full rounded-[12px] bg-lynch-50'
                                            }`
                                        )}
                                    >
                                        <div>{city.name}</div>
                                        <Switch
                                            checked={selectedCity?.includes(
                                                city.name
                                            )}
                                            className='h-5'
                                            id={city.name}
                                            onCheckedChange={() => {
                                                setSelectedCity((prev) => {
                                                    if (
                                                        prev?.includes(
                                                            city.name
                                                        )
                                                    ) {
                                                        return prev?.filter(
                                                            (item) =>
                                                                item !==
                                                                city.name
                                                        )
                                                    }
                                                    return [
                                                        ...(prev || []),
                                                        city.name,
                                                    ]
                                                })
                                            }}
                                        />
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default DialogMulti
