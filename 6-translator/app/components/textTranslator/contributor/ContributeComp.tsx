'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import TextArea from '@/components/ui/textarea';
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
import RenderDialectRadioGroup from './RenderDialectRadioGroup';
interface ContributeCompProps {
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

const ContributeComp: React.FC<ContributeCompProps> = ({
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
	const [sourceLanguage, setSourceLanguage] = useState('ca');
	const [targetLanguage, setTargetLanguage] = useState('zgh');
	const [leftRadioValue, setLeftRadioValue] = useState('central');
	const [rightRadioValue, setRightRadioValue] = useState('central');
	

    const contributeLanguages: { [key: string]: string } = {
        en: 'English',
        zgh: 'ⵜⴰⵎⴰⵣⵉⵖⵜ',
        ber: 'Tamaziɣt',
        es: 'Español',
        ca: 'Català',
        fr: 'Français',
        ary: 'Dàrija',
    };
	const handleSourceLanguageChange = (language) => {
		setSourceLanguage(language);
		if (!['zgh', 'ber'].includes(language)) {
			setLeftRadioValue(''); // Resetting the dialect selection
		}
	}
	
	const handleTargetLanguageChange = (language) => {
		setTargetLanguage(language);
		if (!['zgh', 'ber'].includes(language)) {
			setRightRadioValue(''); // Resetting the dialect selection
		}
	}
    const renderLanguageOptions = useCallback(
        (isSourceLanguage: boolean) => {
            const availableLanguages = isSourceLanguage
                ? Object.keys(LanguageRelations)
                : LanguageRelations[sourceLanguage] || [];

            return availableLanguages.map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                    {contributeLanguages[key]}
                </DropdownMenuRadioItem>
            ));
        },
        [sourceLanguage],
    );

    const handleGenerate = async () => {
        const srcLanguageCode = getLanguageCode(sourceLanguage);
        console.log(srcLanguageCode);
        const config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `http://api.collectivat.cat/translate/random/${srcLanguageCode}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.request(config);
            console.log(response.data.sentence);
            setSourceText(response.data.sentence);
        } catch (error) {
            console.log(error);
        }
    };

	const handleContribute = async ()=>{
		const srcLanguageCode = getLanguageCode(sourceLanguage);
		const tgtLanguageCode = getLanguageCode(targetLanguage);

		console.log(srcLanguageCode,tgtLanguageCode,rightRadioValue,leftRadioValue)
		// const data = {
		// 	src: srcLanguageCode,
		// 	tgt: tgtLanguageCode,
		// 	src_text: sourceText,
		// 	tgt_text: targetText,
		// 	userId: userId,
		// 	isCentral,
		// 	isTif,
		// 	isTac,
		// 	isOther,
		// }

	}
	useEffect(() => {
		console.log("Left Radio Value:", leftRadioValue);
		console.log("Right Radio Value:", rightRadioValue);
	}, [leftRadioValue, rightRadioValue]);

    return (
        <div className="text-translator">
            <div className="flex flex-row justify-center items-baseline px-10 py-20 bg-slate-100">
                <div className="w-1/2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button variant="outline">
                                {contributeLanguages[sourceLanguage]}
                                <ChevronDown className="pl-2 " />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                Select Language
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
                    <TextArea
                        value={sourceText}
                        className="border border-gray-300 rounded-md shadow"
                        placeholder="Type something to translate..."
                        id="message"
                    />
{
    ['zgh', 'ber'].includes(sourceLanguage) && 
    <RenderDialectRadioGroup
        side="left"
        radioValue={leftRadioValue}
        setRadioValue={setLeftRadioValue}
    />
}

                    <Button onClick={handleGenerate}>gen</Button>
                </div>

                <div className="w-1/2 ">
                    <div className="flex flex-row justify-between items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="mb-5" asChild>
                                <Button variant="outline">
                                    {contributeLanguages[targetLanguage]}
                                    <ChevronDown className="pl-2 " />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
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

                    <TextArea
                        id="message"
                        className="border border-gray-300 rounded-md shadow"
                        placeholder="Type something to translate..."
                    />

{
    ['zgh', 'ber'].includes(targetLanguage) && 
    <RenderDialectRadioGroup
        side="right"
        radioValue={rightRadioValue}
        setRadioValue={setRightRadioValue}
    />
}
					<Button onClick={handleContribute}>contribute</Button>
                </div>
            </div>
        </div>
    );
};

export default ContributeComp;
