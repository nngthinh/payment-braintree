import { HostedFields, client, hostedFields } from 'braintree-web';
import { useCallback, useEffect, useRef } from 'react';
import request from 'utils/request';
import './Payment.css';

const CLIENT_AUTHORIZATION =
  'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjMkZ1WkdKdmVDSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbk5oYm1SaWIzZ3VZbkpoYVc1MGNtVmxaMkYwWlhkaGVTNWpiMjBpZlEuZXlKbGVIQWlPakUzTURJMk5EQXhNelFzSW1wMGFTSTZJakkwTUdFMU1qaGhMVGRsT1RJdE5HVTNOeTFpTkdFekxXUXdaakUyTUdKaFlXSmtaU0lzSW5OMVlpSTZJbkZuYmpkeWNIRm5PWGN6Tm5JMWFtb2lMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRndhUzV6WVc1a1ltOTRMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SWl3aWJXVnlZMmhoYm5RaU9uc2ljSFZpYkdsalgybGtJam9pY1dkdU4zSndjV2M1ZHpNMmNqVnFhaUlzSW5abGNtbG1lVjlqWVhKa1gySjVYMlJsWm1GMWJIUWlPbVpoYkhObGZTd2ljbWxuYUhSeklqcGJJbTFoYm1GblpWOTJZWFZzZENKZExDSnpZMjl3WlNJNld5SkNjbUZwYm5SeVpXVTZWbUYxYkhRaVhTd2liM0IwYVc5dWN5STZlMzE5LlBwVUVSN19fSDBWbVNVWTZJckJtTU9zOExQQmFzd21ieGktMXgxcV91MmUzb01UbUNzbkRfYmNmVWh4NUx4M3pudTA2TVN4bjBKSjBjQ3pGellKQWpRIiwiY29uZmlnVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL3FnbjdycHFnOXczNnI1amovY2xpZW50X2FwaS92MS9jb25maWd1cmF0aW9uIiwiZ3JhcGhRTCI6eyJ1cmwiOiJodHRwczovL3BheW1lbnRzLnNhbmRib3guYnJhaW50cmVlLWFwaS5jb20vZ3JhcGhxbCIsImRhdGUiOiIyMDE4LTA1LTA4IiwiZmVhdHVyZXMiOlsidG9rZW5pemVfY3JlZGl0X2NhcmRzIl19LCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvcWduN3JwcWc5dzM2cjVqai9jbGllbnRfYXBpIiwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwibWVyY2hhbnRJZCI6InFnbjdycHFnOXczNnI1amoiLCJhc3NldHNVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImF1dGhVcmwiOiJodHRwczovL2F1dGgudmVubW8uc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbSIsInZlbm1vIjoib2ZmIiwiY2hhbGxlbmdlcyI6W10sInRocmVlRFNlY3VyZUVuYWJsZWQiOnRydWUsImFuYWx5dGljcyI6eyJ1cmwiOiJodHRwczovL29yaWdpbi1hbmFseXRpY3Mtc2FuZC5zYW5kYm94LmJyYWludHJlZS1hcGkuY29tL3FnbjdycHFnOXczNnI1amoifSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImJpbGxpbmdBZ3JlZW1lbnRzRW5hYmxlZCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJhbGxvd0h0dHAiOnRydWUsImRpc3BsYXlOYW1lIjoiR09UIElUIENPIiwiY2xpZW50SWQiOm51bGwsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImVudmlyb25tZW50Ijoib2ZmbGluZSIsImJyYWludHJlZUNsaWVudElkIjoibWFzdGVyY2xpZW50MyIsIm1lcmNoYW50QWNjb3VudElkIjoiZ290aXRjbyIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9fQ==';

export default function PaymentPage() {
  const submitButtonRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInitiated = useRef(false);

  const handleSubmitPayment = useCallback(async (hostedFields: HostedFields | undefined, e: MouseEvent) => {
    e.preventDefault();
    submitButtonRef.current?.setAttribute("disabled", "disabled");

    try {
      const result = await hostedFields?.tokenize();
      submitButtonRef.current?.removeAttribute("disabled");
      if (formRef.current && result) {
        formRef.current['payment_method_nonce'].value = result.nonce;
        request.post('/api/checkout', {
          amount: formRef.current['amount'].value,
          paymentMethodNonce: "fake-valid-nonce",
        })
      }
    } catch (err) {
      console.log((err as Error));
    }
  }, []);

  const initPayment = useCallback(async () => {
    console.log('huhu')
    try {
      const clientInstance = await client.create(
        {
          authorization: CLIENT_AUTHORIZATION,
        },
      );
  
      const hostedFieldsInstance = await hostedFields.create(
        {
          client: clientInstance,
          styles: {
            'input': {
              'font-size': '16pt',
              'color': '#3A3A3A',
            },
  
            '.number': {
              'font-family': 'monospace',
            },
  
            '.valid': {
              color: 'green',
            },
          },
          fields: {
            number: {
              selector: '#card-number',
            },
            cvv: {
              selector: '#cvv',
            },
            expirationDate: {
              selector: '#expiration-date',
            },
          },
        });
      if (submitButtonRef.current) {
        submitButtonRef.current.addEventListener('click', (e) => handleSubmitPayment(hostedFieldsInstance, e));
        submitButtonRef.current.removeAttribute("disabled");
      }
    } catch (err) {
      console.log((err as Error));
    }
  }, [handleSubmitPayment]);

  useEffect(() => {
    if (!isInitiated.current) {
      initPayment();
      isInitiated.current = true;
    }
  }, [initPayment]);

  return (
    <div>
      <form
        action="/"
        id="my-sample-form"
        ref={formRef}
      >
        <input
          type="hidden"
          name="payment_method_nonce"
        />
        <label htmlFor="amount">Amount</label>
        <input name="amount" type="number" placeholder='1,000,000'/>
        
        <label htmlFor="card-number">Card Number</label>
        <div id="card-number"></div>

        <label htmlFor="cvv">CVV</label>
        <div id="cvv"></div>

        <label htmlFor="expiration-date">Expiration Date</label>
        <div id="expiration-date"></div>

        <input
          ref={submitButtonRef}
          id="my-submit"
          type="submit"
          value="Pay"
          disabled
        />
      </form>
    </div>
  );
}
