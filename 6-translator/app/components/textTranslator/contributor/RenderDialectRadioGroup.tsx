import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
interface RenderDialectRadioGroupProps {
    side: 'left' | 'right';
    sourceLanguage: string;
    targetLanguage: string;
    leftRadioValue: string;
    rightRadioValue: string;
    setLeftRadioValue: (value: string) => void;
    setRightRadioValue: (value: string) => void;
}
const RenderDialectRadioGroup = ({
    side,
    radioValue,
    setRadioValue,
}) => 
{
	console.log("Radio Value in RenderDialectRadioGroup:", radioValue);

    return (
        <RadioGroup className="grid-cols-4 mt-3 justify-start">
            {['central', 'tarifit', 'tachelhit', 'other'].map((value) => (
                <div className="flex items-center space-x-2" key={value}>
                    <RadioGroupItem
                        value={value}
                        id={`${value}-${side}`}
                        checked={radioValue === value}
                        onChange={() => setRadioValue(value)}
                    />
                    <Label htmlFor={`${value}-${side}`}>{value}</Label>
                </div>
            ))}
        </RadioGroup>
    );
};

export default RenderDialectRadioGroup;
