import { useFormContext } from 'react-hook-form';

const Consent = () => {
    const form= useFormContext(); 
    return (
        <div>
            <label>
                <input type="checkbox" {...form.register('isPrivacy')} />I agree to
                the Privacy Policy
            </label>
            <label>
                <input type="checkbox" {...form.register('isSubscribed')} />
                Subscribe to newsletter
            </label>
        </div>
    );
};

export default Consent;
