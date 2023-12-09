import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
interface RenderDialectRadioGroupProps {
    side: 'left' | 'right';
    Var: string;

    setVar: (value: string) => void;
}
const RenderDialectRadioGroup: React.FC<RenderDialectRadioGroupProps> = ({
    side,
    Var,
    setVar,
}) => {
    console.log('Radio Value in RenderDialectRadioGroup:', Var);

    return (
        <RadioGroup className="grid-cols-4 mt-3 justify-start">
            {['central', 'tarifit', 'tachelhit', 'other'].map((value) => (
                <div className="flex items-center space-x-2" key={value}>
                    <RadioGroupItem
                        value={value}
                        id={`${value}-${side}`}
                        checked={Var === value}
                        onChange={() => setVar(value)}
                    />
                    <Label htmlFor={`${value}-${side}`}>{value}</Label>
                </div>
            ))}
        </RadioGroup>
    );
};

export default RenderDialectRadioGroup;
