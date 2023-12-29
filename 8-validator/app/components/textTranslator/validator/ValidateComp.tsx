'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, HelpCircle, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axios from 'axios';
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from '@/components/ui/hover-card';
import { LanguageRelations, getLanguageCode } from '../TranslatorConfig';
import toast from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getSession, useSession } from 'next-auth/react';
import { Checkbox } from '@/components/ui/checkbox';
interface ValidateCompProps {
    userId: string;
    isLangZgh?: boolean;
    isLangBer?: boolean;
    isCentral?: boolean;
    isTif?: boolean;
    isTac?: boolean;
    isOther?: boolean;
    src?: string;
    tgt?: string;
    src_text?: string;
    tgt_text?: string;
}

const ValidateComp: React.FC<ValidateCompProps> = ({
    userId,
    isLangZgh,
    isLangBer,
    isCentral,
    isTif,
    isTac,
    isOther,
    src,
    tgt,
    src_text,
    tgt_text,
}) => {
    const [sourceText, setSourceText] = useState('');
    const [targetText, setTargetText] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState(
        localStorage.getItem('sourceLanguage') || 'ca',
    );
    const [targetLanguage, setTargetLanguage] = useState(
        localStorage.getItem('targetLanguage') || 'zgh',
    );
    const [srcVar, setLeftRadioValue] = useState(
        localStorage.getItem('srcVar') || '',
    );
    const [tgtVar, setRightRadioValue] = useState(
        localStorage.getItem('tgtVar') || '',
    );

    // Update local storage when the language or variation changes
    useEffect(() => {
        localStorage.setItem('sourceLanguage', sourceLanguage);
        localStorage.setItem('targetLanguage', targetLanguage);
        localStorage.setItem('srcVar', srcVar);
        localStorage.setItem('tgtVar', tgtVar);
    }, [sourceLanguage, targetLanguage, srcVar, tgtVar]);

    const router = useRouter();
    const { data: session, update: sessionUpdate } = useSession();
    const [entry, setEntry] = useState<any>();
    const updatedSession = async () => {
        const session = await getSession();
        console.log(session);
    };
    // render variations conditionally
    const renderRadioGroup = (side: 'left' | 'right') => {
        const languagesToRender =
            (side === 'left' && ['zgh', 'ber'].includes(sourceLanguage)) ||
            (side === 'right' && ['zgh', 'ber'].includes(targetLanguage));

        if (languagesToRender) {
            const radioGroupValue = side === 'left' ? srcVar : tgtVar;

            return (
                <RadioGroup className="grid-cols-4 mt-3 justify-start">
                    {['Central', 'Tarifit', 'Tachelhit', 'Other'].map(
                        (value) => (
                            <div
                                className="flex flex-row justify-start items-center space-x-2"
                                key={value}
                            >
                                <Checkbox
                                    value={value}
                                    id={`${value}-${side}`}
                                    checked={radioGroupValue === value}
                                    onCheckedChange={(newCheckedState) => {
                                        if (
                                            typeof newCheckedState === 'boolean'
                                        ) {
                                            const newValue = value; // 'value' is the value of the radio item
                                            side === 'left'
                                                ? setLeftRadioValue(newValue)
                                                : setRightRadioValue(newValue);
                                        }
                                    }}
                                />
                                <Label htmlFor={`${value}-${side}`}>
                                    {value}
                                </Label>
                            </div>
                        ),
                    )}
                </RadioGroup>
            );
        } else {
            return null;
        }
    };

    useEffect(() => {
        console.log('Left Radio Value:', srcVar);
        console.log('Right Radio Value:', tgtVar);
    }, [tgtVar, srcVar]);
    // Update target language options when source language changes
    useEffect(() => {
        const updateLanguages = () => {
            const relatedToSource = LanguageRelations[sourceLanguage] || [];
            const relatedToTarget = LanguageRelations[targetLanguage] || [];

            if (!relatedToSource.includes(targetLanguage)) {
                // Update target language if current target is not related to the new source
                setTargetLanguage(
                    relatedToSource.length > 0 ? relatedToSource[0] : '',
                );
            } else if (!relatedToTarget.includes(sourceLanguage)) {
                // Update source language if current source is not related to the new target
                setSourceLanguage(
                    relatedToTarget.length > 0 ? relatedToTarget[0] : '',
                );
            }
        };

        updateLanguages();
    }, [sourceLanguage, targetLanguage]);

    const validateLanguage: { [key: string]: string } = useMemo(
        () => ({
            en: 'English',
            zgh: 'ⵜⴰⵎⴰⵣⵉⵖⵜ',
            ber: 'Tamaziɣt',
            es: 'Español',
            ca: 'Català',
            fr: 'Français',
            ary: 'الدارجة',
        }),
        [],
    );

    const handleSourceLanguageChange = (language: string) => {
        setSourceLanguage(language);
        localStorage.setItem('sourceLanguage', language);
        if (!['zgh', 'ber'].includes(language)) {
            setLeftRadioValue('');
            localStorage.setItem('srcVar', '');
        }
    };

    const handleTargetLanguageChange = (language: string) => {
        setTargetLanguage(language);
        localStorage.setItem('targetLanguage', language);
        if (!['zgh', 'ber'].includes(language)) {
            setRightRadioValue('');
            localStorage.setItem('tgtVar', '');
        }
    };
    const renderLanguageOptions = useCallback(
        (isSourceLanguage: boolean) => {
            const availableLanguages = isSourceLanguage
                ? Object.keys(LanguageRelations)
                : LanguageRelations[sourceLanguage] || [];

            return availableLanguages.map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                    {validateLanguage[key]}
                </DropdownMenuRadioItem>
            ));
        },
        [sourceLanguage, validateLanguage],
    );
    // retrieve contribution item
    console.log();
    const handleDataFetch = async () => {
        const srcLangCode = getLanguageCode(sourceLanguage);
        const tgtLangCode = getLanguageCode(targetLanguage);

        // TODO need to change url
        try {
            const url = `https://awaldigital.vercel.app/api/contribute?src=${encodeURIComponent(
                srcLangCode,
            )}&tgt=${encodeURIComponent(tgtLangCode)}`;
            // Make the GET request
            const res = await axios.get(url);
            console.log(res);
            console.log(res.status);
            if (res.data) {
                setSourceText(res.data.src_text || '');
                setTargetText(res.data.tgt_text || '');
                setLeftRadioValue(res.data.srcVar || '');
                setRightRadioValue(res.data.tgtVar || '');
            }
            setEntry(res.data);
            console.log(tgtVar);
        } catch (error) {
            if (axios.isAxiosError(error) && error.request.status) {
                toast(
                    'well done! no more entry for current language pair, try something else',
                    { position: 'bottom-center', icon: '👏' },
                );
            }
        }
    };

    console.log(entry);
    // validate post route
    const handleValidate = async () => {
        const data = { ...entry };
        try {
            const res = await axios.patch('/api/contribute/accept', data);

            const updatedUser = res.data;
            console.log(updatedUser);
            sessionUpdate({ user: updatedUser });
            toast.success('Validation successful, points added!', {
                position: 'bottom-center',
            });
        } catch (error) {
            console.log(error);
            toast.error('An error occurred during validation.', {
                position: 'bottom-center',
            });
        }
    };

    const handleRejection = async () => {
        const data = { ...entry };
        try {
            const res = await axios.patch('/api/contribute/reject', data);
            const updatedUser = res.data;
            sessionUpdate({ user: updatedUser });
            toast.success(
                'Thank you for validating. You have earned 1 point.',
                { position: 'bottom-center' },
            );
        } catch (error) {
            console.log(error);
            toast.error('An error occurred during rejection handling.', {
                position: 'bottom-center',
            });
        }
    };
    const handleReport = async () => {
        toast.error('Report not yet implemented', {
            position: 'bottom-center',
        });
    };
    return (
        <div className="text-translator">
            <div className="flex flex-row justify-center items-baseline px-10 space-x-10">
                <div className="w-1/2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button
                                variant="outline"
                                className="text-text-primary  bg-transparent border-text-primary"
                            >
                                {validateLanguage[sourceLanguage]}
                                <ChevronDown className="pl-2 " />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-[#EFBB3F] border-[#EFBB3F] text-text-primary">
                            <DropdownMenuLabel>
                                Selecciona l&apos;idioma
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={sourceLanguage}
                                onValueChange={handleSourceLanguageChange}
                            >
                                {renderLanguageOptions(true)}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Textarea
                        value={sourceText}
                        className="border border-gray-300 h-[50vh] rounded-md shadow"
                        placeholder="Escriviu alguna cosa per traduir.."
                        id="src_message"
                    />
                    {renderRadioGroup('left')}
                    <div className="flex flex-row justify-between items-center pt-10 w-full">
                        <Button
                            onClick={handleDataFetch}
                            variant="default"
                            className="rounded-full text-text-primary bg-text-accent"
                        >
                            Frase aleat&#242;ria
                        </Button>
                        <Button
                            variant={'destructive'}
                            className="rounded-full bg-red-500"
                            onClick={handleReport}
                        >
                            Informa
                        </Button>
                    </div>
                </div>

                <div className="w-1/2 ">
                    <div className="flex flex-row justify-between items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="mb-5" asChild>
                                <Button
                                    variant="outline"
                                    className="text-text-primary  bg-transparent border-text-primary"
                                >
                                    {validateLanguage[targetLanguage]}
                                    <ChevronDown className="pl-2 " />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-[#EFBB3F] border-[#EFBB3F] text-text-primary">
                                <DropdownMenuLabel>
                                    Select Language
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={targetLanguage}
                                    onValueChange={handleTargetLanguageChange}
                                >
                                    {renderLanguageOptions(false)}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <Button
                                    size={'xs'}
                                    className="cursor-pointer rounded-3xl m-1 text-xs"
                                >
                                    how does it work
                                    <HelpCircle className="ml-2" size={15} />
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-20">
                                <div className="flex justify-between space-x-4">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-semibold">
                                            header header header header header
                                            header header header header header
                                        </h4>
                                        <p className="text-sm ">body</p>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>

                    <Textarea
                        id="tgt_message"
                        className="border border-gray-300 h-[50vh] rounded-md shadow"
                        placeholder="Escriviu alguna cosa per traduir.."
                        value={targetText}
                        onChange={(e) => setTargetText(e.target.value)}
                    />

                    {renderRadioGroup('right')}
                </div>
            </div>
            <div className="flex flex-row justify-center items-center space-x-4 my-3">
                <Check
                    className="bg-green-500 rounded-full h-10 w-10"
                    onClick={handleValidate}
                />
                <X
                    className="bg-red-500 rounded-full h-10 w-10"
                    onClick={handleRejection}
                />
            </div>
        </div>
    );
};

export default ValidateComp;
