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
import Loader from '@/components/Loader';
import { AlertDialog, AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import {
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import useLocaleStore from '@/app/hooks/languageStore';

interface ValidateCompProps {
    userId: string;
}

const ValidateComp: React.FC<ValidateCompProps> = ({ userId }) => {
    const [sourceText, setSourceText] = useState('');
    const [targetText, setTargetText] = useState('');
	const {locale} = useLocaleStore();

    const [sourceLanguage, setSourceLanguage] = useState(
        localStorage.getItem('sourceLanguage') || 'ca',
    );
    const [targetLanguage, setTargetLanguage] = useState(
        localStorage.getItem('targetLanguage') || 'es',
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
    const [isLoading, setIsLoading] = useState(false);
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
                                    onCheckedChange={() => {
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
                setTargetLanguage(
                    relatedToSource.length > 0 ? relatedToSource[0] : '',
                );
            } else if (!relatedToTarget.includes(sourceLanguage)) {
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
            ber: 'Tamaziɣt',
            es: 'Español',
            ca: 'Català',
            fr: 'Français',
            ary: 'الدارجة',
        }),
        [],
    );
    const getNextLanguage = (currentLanguage:string, availableLanguages:string[]) => {
        if (availableLanguages.length === 0) return 'ca';

        const currentIndex = availableLanguages.indexOf(currentLanguage);
        const nextIndex = (currentIndex + 1) % availableLanguages.length;
        return availableLanguages[nextIndex];
    };

    const handleSourceLanguageChange = (language: string) => {
        setSourceLanguage(language);
        const availableTargetLanguages =
            ContributionLanguageRelations[language] || [];
        if (!availableTargetLanguages.includes(targetLanguage)) {
            setTargetLanguage(availableTargetLanguages[0] || 'ca');
        }
        // Resetting the dialect selection
        if (!['zgh', 'ber'].includes(language)) setLeftRadioValue('');
    };

    const handleTargetLanguageChange = (language: string) => {
        setTargetLanguage(language);
        const availableSourceLanguages = Object.keys(
            ContributionLanguageRelations,
        ).filter((key) =>
            ContributionLanguageRelations[key].includes(language),
        );
        if (!availableSourceLanguages.includes(sourceLanguage)) {
            setSourceLanguage(
                getNextLanguage(sourceLanguage, availableSourceLanguages),
            );
        }
        // Resetting the dialect selection
        if (!['zgh', 'ber'].includes(language)) setRightRadioValue('');
    };

    const renderLanguageOptions = useCallback(
        (isSourceLanguage: boolean) => {
            let availableLanguages = isSourceLanguage
                ? Object.keys(ContributionLanguageRelations)
                : ContributionLanguageRelations[sourceLanguage] || [];

            return availableLanguages
                .sort((a, b) =>
                    contributeLanguages[a].localeCompare(
                        contributeLanguages[b],
                    ),
                )
                .map((key) => (
                    <DropdownMenuRadioItem key={key} value={key}>
                        {contributeLanguages[key]}
                    </DropdownMenuRadioItem>
                ));
        },
        [sourceLanguage, contributeLanguages],
    );

    // src_text generate get route
    const handleGenerate = async () => {
       
    };

    // contribution post route
    const handleContribute = async () => {
        
    };

    // machine translation route
    const handleTranslate = async () => {
       
    };

    const handleReport = async () => {
        toast.error('Report not yet implemented', {
            position: 'bottom-center',
        });
    };

    return (
        <div className="text-translator ">
            {isLoading && <Loader />}
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
                        placeholder="Escriviu alguna cosa per traduir.."
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

                        
                    </div>

                    <Textarea
                        id="tgt_message"
                        className="border border-gray-300 rounded-md h-[50vh] shadow"
                        placeholder="Escriviu alguna cosa per traduir.."
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

            
        </div>
    );
};

export default ValidateComp;
