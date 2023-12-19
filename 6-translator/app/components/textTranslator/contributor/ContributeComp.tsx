'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
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
import {
    ContributionLanguageRelations,
    getLanguageCode,
} from '../TranslatorConfig';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';

interface ContributeCompProps {
    userId: string;
}

const ContributeComp: React.FC<ContributeCompProps> = ({ userId }) => {
    const [sourceText, setSourceText] = useState('');
    const [targetText, setTargetText] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState(
        localStorage.getItem('sourceLanguage') || 'ca',
    );
    const [targetLanguage, setTargetLanguage] = useState(
        localStorage.getItem('targetLanguage') || 'zgh',
    );
    const [tgtVar, setLeftRadioValue] = useState(
        localStorage.getItem('tgtVar') || '',
    );
    const [srcVar, setRightRadioValue] = useState(
        localStorage.getItem('srcVar') || '',
    );
    // check if the user modified the machine translation, if they used the translate button, this is done simply checking if the contribution field has any manual changes
    const [translated, setTranslated] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    console.log(session);
    const { update: sessionUpdate } = useSession();

    // read from local storage
    useEffect(() => {
        localStorage.setItem('sourceLanguage', sourceLanguage);
        localStorage.setItem('targetLanguage', targetLanguage);
        localStorage.setItem('tgtVar', tgtVar);
        localStorage.setItem('srcVar', srcVar);
    }, [sourceLanguage, targetLanguage, tgtVar, srcVar]);

    // render variations conditionally
    const renderRadioGroup = (side: 'left' | 'right') => {
        const languagesToRender =
            (side === 'left' && ['zgh', 'lad'].includes(sourceLanguage)) ||
            (side === 'right' && ['zgh', 'lad'].includes(targetLanguage));

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
                                <input
                                    className="w-4 h-4 border-3 "
                                    type="radio"
                                    value={value}
                                    id={`${value}-${side}`}
                                    checked={radioGroupValue === value}
                                    onChange={() => {
                                        side === 'left'
                                            ? setRightRadioValue(value)
                                            : setLeftRadioValue(value);
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

    // ' check point
    useEffect(() => {
        console.log('Left Radio Value:', srcVar);
        console.log('Right Radio Value:', tgtVar);
    }, [tgtVar, srcVar]);
    // Update target language options when source language changes
    useEffect(() => {
        const updateLanguages = () => {
            const relatedToSource =
                ContributionLanguageRelations[sourceLanguage] || [];
            const relatedToTarget =
                ContributionLanguageRelations[targetLanguage] || [];

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

    const contributeLanguages: { [key: string]: string } = useMemo(
        () => ({
            en: 'English',
            zgh: 'ⵜⴰⵎⴰⵣⵉⵖⵜ',
            lad: 'Tamaziɣt',
            es: 'Español',
            ca: 'Catal&#224;',
            fr: 'Français',
            ary: 'D&#224;rija',
        }),
        [],
    );

    const handleSourceLanguageChange = (language: string) => {
        setSourceLanguage(language);
        if (!['zgh', 'lad'].includes(language)) {
            setLeftRadioValue(''); // Resetting the dialect selection
        }
    };

    const handleTargetLanguageChange = (language: string) => {
        setTargetLanguage(language);
        if (!['zgh', 'lad'].includes(language)) {
            setRightRadioValue(''); // Resetting the dialect selection
        }
    };
    const renderLanguageOptions = useCallback(
        (isSourceLanguage: boolean) => {
            const availableLanguages = isSourceLanguage
                ? Object.keys(ContributionLanguageRelations)
                : ContributionLanguageRelations[sourceLanguage] || [];

            return availableLanguages.map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                    {contributeLanguages[key]}
                </DropdownMenuRadioItem>
            ));
        },
        [sourceLanguage, contributeLanguages],
    );
    // src_text generate get route
    const handleGenerate = async () => {
        const srcLanguageCode = getLanguageCode(sourceLanguage);
        console.log(srcLanguageCode);
        const config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `https://api.collectivat.cat/translate/random/${srcLanguageCode}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            const res = await axios.request(config);
            console.log(res.data.sentence);
            setSourceText(res.data.sentence);
        } catch (error) {
            console.log(error);
        }
    };

    // contribution post route
    const handleContribute = async () => {
        const srcLanguageCode = getLanguageCode(sourceLanguage);
        const tgtLanguageCode = getLanguageCode(targetLanguage);
        const contributionPoint = targetText.length;
        if (!translated) {
            toast.error('Please translate the text before contribute');
            return;
        }
        console.log(targetText);
        console.log(
            srcLanguageCode,
            tgtLanguageCode,
            srcVar,
            tgtVar,
            sourceText,
            targetText,
            contributionPoint,
        );
        const data = {
            src: srcLanguageCode,
            tgt: tgtLanguageCode,
            src_text: sourceText,
            tgt_text: targetText,
            contributionPoint,
            userId,
            srcVar,
            tgtVar,
        };
        // input length check
        if (data.src_text.length === 0 || data.tgt_text.length === 0) {
            toast.error('No text to contribute');
            return;
        }
        // await updatedSession();
        // const updatedScore = session.user.score + contributionPoint;
        // session.user.score = updatedScore;
        if (
            ((srcLanguageCode === 'lad' || srcLanguageCode === 'zgh') &&
                !srcVar) ||
            ((tgtLanguageCode === 'lad' || tgtLanguageCode === 'zgh') &&
                !tgtVar)
        ) {
            toast.error('Please select a variant for Amazigh languages.');
            return;
        }
        console.log(data);
        if (data.userId.length === 0) {
            router.push('/signIn', { scroll: false });
        }
        try {
            const res = await axios.post(
                `/api/contribute`,
                JSON.stringify(data),
            );
            toast.success(
                <span>
                    Gr&#224;cies per la seva contribuci&#243;! Acaba de guanyar
                    <span className="font-bold text-clay-500">
                        {contributionPoint}
                    </span>{' '}
                    punts!
                </span>,
            );
            router.refresh();
            setSourceText('');
            setTargetText('');

            const updatedUser = res.data;
            console.log(res.data.score);
            sessionUpdate({ user: updatedUser });
        } catch (error) {
            console.log(error);
        }
        setTimeout(async () => {
            const updatedSession = await getSession();
            console.log(updatedSession);
        }, 1000); // Delay of 1 second
    };

    // machine translation route
    const handleTranslate = async () => {
        if (!sourceText || sourceLanguage === targetLanguage) {
            setTargetText('');
            setTranslated(false);
            return;
        }
        const srcLanguageCode = sourceLanguage;
        const tgtLanguageCode = targetLanguage;

        // send request data differently according to line break: (text or batch ['',''])
        let requestData;
        // remove the last line if there are any \n
        const processedSource = sourceText.replace(/\n$/, '');

        if (sourceText.includes('\n') && !sourceText.endsWith('\n')) {
            requestData = {
                src: srcLanguageCode,
                tgt: tgtLanguageCode,
                batch: processedSource.split('\n'),
                token: 'E1Ws_mmFHO6WgqFUYtsOZR9_B4Yhvdli_e-M5R9-Roo',
            };
        } else {
            requestData = {
                src: srcLanguageCode,
                tgt: tgtLanguageCode,
                text: processedSource,
                token: 'E1Ws_mmFHO6WgqFUYtsOZR9_B4Yhvdli_e-M5R9-Roo',
            };
        }
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.collectivat.cat/translate/',
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestData,
        };
        try {
            const response = await axios.request(config);
            console.log(response.data);
            // Check if response data is an array
            if (Array.isArray(response.data.translation)) {
                // If it's an array, join the array elements with a newline character to form a string
                setTargetText(response.data.translation.join('\n'));
            } else {
                // If it's not an array, assume it's a string and set it directly
                setTargetText(response.data.translation);
            }
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setTranslated(false);
        }
    };

    const handleReport = async () => {
        toast.error('Report not yet implemented');
    };

    return (
        <div className="text-translator ">
            <div className="flex flex-row justify-center items-baseline px-10 space-x-10">
                <div className="w-1/2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button
                                variant="outline"
                                className="text-text-primary  bg-transparent border-text-primary"
                            >
                                {contributeLanguages[sourceLanguage]}
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
                        placeholder="Type something to translate..."
                        id="src_message"
                        onChange={(e) => setSourceText(e.target.value)}
                    />

                    {renderRadioGroup('left')}
                    <div className="flex flex-row justify-between items-center pt-10 w-full">
                        <div className="flex flex-row space-x-3">
                            <Button
                                onClick={handleGenerate}
                                variant="default"
                                className="rounded-full bg-text-secondary"
                            >
                                Frase aleat&#242;ria
                            </Button>
                            <Button
                                onClick={handleTranslate}
                                variant="default"
                                className="rounded-full bg-text-primary"
                            >
                                Traduir
                            </Button>
                        </div>
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
                                    {contributeLanguages[targetLanguage]}
                                    <ChevronDown className="pl-2 " />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-[#EFBB3F] border-[#EFBB3F] text-text-primary">
                                <DropdownMenuLabel>
                                    Selecciona l&apos;idioma
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
                                    className="cursor-pointer rounded-3xl m-1 text-xs capitalize"
                                >
                                    Com funciona?
                                    <HelpCircle className="ml-2" size={15} />
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-[20rem] mr-[4rem]">
                                <div className=" space-y-1">
                                    <h4 className="text-sm font-semibold capitalize">
                                        Lorem ipsum dolor sit amet,
                                    </h4>
                                    <p className="text-sm">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea commodo consequat.
                                        Duis aute irure dolor in reprehenderit
                                        in voluptate velit esse cillum dolore eu
                                        fugiat nulla pariatur. Excepteur sint
                                        occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim
                                        id est laborum.
                                    </p>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>

                    <Textarea
                        id="tgt_message"
                        className="border border-gray-300 rounded-md h-[50vh] shadow"
                        placeholder="Type something to translate..."
                        value={targetText}
                        onChange={(e) => {
                            setTargetText(e.target.value);
                            setTranslated(true);
                        }}
                    />
                    {renderRadioGroup('right')}
                    <div className="flex justify-end mt-10">
                        <Button
                            variant={'default'}
                            onClick={handleContribute}
                            className="rounded-full bg-text-primary"
                        >
                            Contribuir
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex flex-col bg-[#EFBB3F] w-1/3 rounded-md shadow-sm px-4 py-5 ml-10 mb-5">
                <h1 className="font-bold capitalize">Recursos &#250;tils </h1>
                <Link href={'https://www.amazic.cat/'} target="_blank">
                    amazic.cat - amazic-catalan dictionary
                </Link>
            </div>
        </div>
    );
};

export default ContributeComp;
