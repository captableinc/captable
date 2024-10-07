import { Indent, type SafeProps, style } from "@/components/safe/templates";
import { formatDate, formatPercentage, formatUsd } from "@/lib/format";
import { Document, Image, Link, Page, Text, View } from "@react-pdf/renderer";

const PostMoneyDiscount = ({
  investor,
  investment,
  discountRate,
  date,
  company,
  options,
  sender,
}: SafeProps) => {
  const { title, author, subject, keywords, creator, producer } = options;

  return (
    <Document
      title={title}
      author={author}
      creator={creator}
      subject={subject}
      keywords={keywords}
      producer={producer}
    >
      <Page style={style.body} size="A4">
        <Text style={[style.bold, style.right]}>Version 1.2</Text>
        <Text
          style={[
            style.title,
            style.upcase,
            style.bold,
            style.center,
            style.pb20,
          ]}
        >
          DISCOUNT ONLY
        </Text>
        <Text style={style.textSm}>
          THIS INSTRUMENT AND ANY SECURITIES ISSUABLE PURSUANT HERETO HAVE NOT
          BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED (THE “
          SECURITIES ACT ”), OR UNDER THE SECURITIES LAWS OF CERTAIN STATES.
          THESE SECURITIES MAY NOT BE OFFERED, SOLD OR OTHERWISE TRANSFERRED,
          PLEDGED OR HYPOTHECATED EXCEPT AS PERMITTED IN THIS SAFE AND UNDER THE
          ACT AND APPLICABLE STATE SECURITIES LAWS PURSUANT TO AN EFFECTIVE
          REGISTRATION STATEMENT OR AN EXEMPTION THEREFROM.
        </Text>

        <Text
          style={{
            color: "blue",
            fontWeight: "bold",
            textTransform: "uppercase",
            textAlign: "center",
            paddingTop: 20,
            fontFamily: "Times-Bold",
          }}
        >
          Captable, Inc.
        </Text>

        <Text style={[style.bold, style.center, style.pt20]}>SAFE</Text>

        <Text style={[style.bold, style.center]}>
          (Simple Agreement for Future Equity)
        </Text>

        <Text style={[style.pt20]}>
          <Indent>
            THIS <Text style={{ fontFamily: "Times-Bold" }}>CERTIFIES</Text>{" "}
            THAT in exchange for the payment by{" "}
            <Text style={{ color: "blue" }}>{investor.name}</Text> (the
            “Investor”) of{" "}
            <Text style={{ color: "blue" }}>{formatUsd(investment)}</Text> (the
            “Purchase Amount”) on or about{" "}
            <Text style={{ color: "blue" }}>{formatDate(date)}</Text>,{" "}
            <Text style={{ color: "blue" }}>{company.name}</Text>, a{" "}
            <Text style={{ color: "blue" }}>{company.state}</Text> corporation
            (the “Company”), issues to the Investor the right to certain shares
            of the Company’s Capital Stock, subject to the terms described
            below.
          </Indent>
        </Text>

        <Text style={[style.pt20]}>
          <Indent>
            This Safe is one of the forms available at{" "}
            <Link src="http://ycombinator.com/documents">
              http://ycombinator.com/documents
            </Link>{" "}
            and the Company and the Investor agree that neither one has modified
            the form, except to fill in blanks and bracketed terms.
          </Indent>
        </Text>

        {discountRate && (
          <Text style={[style.pt20]}>
            <Indent>
              The “Discount rate” is{" "}
              <Text style={{ color: "blue" }}>
                {formatPercentage(discountRate)}
              </Text>
              . See Section 2 for certain additional defined terms.
            </Indent>
          </Text>
        )}

        <Text style={[style.pt20]}>
          <Indent>1. Events</Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (a){" "}
            <Text style={{ textDecoration: "underline" }}>
              Equity Financing
            </Text>
            . If there is an Equity Financing before the termination of this
            Safe, on the initial closing of such Equity Financing, this Safe
            will automatically convert into the greater of: (1) the number of
            shares of Standard Preferred Stock equal to the Purchase Amount
            divided by the lowest price per share of the Standard Preferred
            Stock; or (2) the number of shares of Safe Preferred Stock equal to
            the Purchase Amount divided by the Safe Price.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            In connection with the automatic conversion of this Safe into shares
            of Standard Preferred Stock or Safe Preferred Stock, the Investor
            will execute and deliver to the Company all of the transaction
            documents related to the Equity Financing; provided, that such
            documents (i) are the same documents to be entered into with the
            purchasers of Standard Preferred Stock, with appropriate variations
            for the Safe Preferred Stock if applicable, and (ii) have customary
            exceptions to any drag-along applicable to the Investor, including
            (without limitation) limited representations, warranties, liability
            and indemnification obligations for the Investor.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (b){" "}
            <Text style={{ textDecoration: "underline" }}>Liquidity Event</Text>
            . If there is a Liquidity Event before the termination of this Safe,
            the Investor will automatically be entitled (subject to the
            liquidation priority set forth in Section 1(d) below) to receive a
            portion of Proceeds, due and payable to the Investor immediately
            prior to, or concurrent with, the consummation of such Liquidity
            Event, equal to the greater of (i) the Purchase Amount (the
            “Cash-Out Amount”) or (ii) the amount payable on the number of
            shares of Common Stock equal to the Purchase Amount divided by the
            Liquidity Price (the “Conversion Amount”). If any of the Company’s
            securityholders are given a choice as to the form and amount of
            Proceeds to be received in a Liquidity Event, the Investor will be
            given the same choice, provided that the Investor may not choose to
            receive a form of consideration that the Investor would be
            ineligible to receive as a result of the Investor’s failure to
            satisfy any requirement or limitation generally applicable to the
            Company’s securityholders, or under any applicable laws.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            Notwithstanding the foregoing, in connection with a Change of
            Control intended to qualify as a tax-free reorganization, the
            Company may reduce the cash portion of Proceeds payable to the
            Investor by the amount determined by its board of directors in good
            faith for such Change of Control to qualify as a tax-free
            reorganization for U.S. federal income tax purposes, provided that
            such reduction (A) does not reduce the total Proceeds payable to
            such Investor and (B) is applied in the same manner and on a pro
            rata basis to all securityholders who have equal priority to the
            Investor under Section 1(d).
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (c){" "}
            <Text style={{ textDecoration: "underline" }}>
              Dissolution Event
            </Text>
            . If there is a Dissolution Event before the termination of this
            Safe, the Investor will automatically be entitled (subject to the
            liquidation priority set forth in Section 1(d) below) to receive a
            portion of Proceeds equal to the Cash-Out Amount, due and payable to
            the Investor immediately prior to the consummation of the
            Dissolution Event.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (d){" "}
            <Text style={{ textDecoration: "underline" }}>
              Liquidation Priority
            </Text>
            . In a Liquidity Event or Dissolution Event, this Safe is intended
            to operate like standard non-participating Preferred Stock. The
            Investor’s right to receive its Cash-Out Amount is:
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="lg">
            (i) {"     "} Junior to payment of outstanding indebtedness and
            creditor claims, including contractual claims for payment and
            convertible promissory notes (to the extent such convertible
            promissory notes are not actually or notionally converted into
            Capital Stock);
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="lg">
            (ii) {"     "} On par with payments for other Safes and/or Preferred
            Stock, and if the applicable Proceeds are insufficient to permit
            full payments to the Investor and such other Safes and/or Preferred
            Stock, the applicable Proceeds will be distributed pro rata to the
            Investor and such other Safes and/or Preferred Stock in proportion
            to the full payments that would otherwise be due; and
          </Indent>
        </Text>

        <Text style={[style.pt20]}>
          <Indent size="lg">
            (iii) {"     "} Senior to payments for Common Stock.
          </Indent>
        </Text>

        <Text style={[style.pt5]}>
          <Indent size="lg">
            The Investor’s right to receive its Conversion Amount is (A) on par
            with payments for Common Stock and other Safes and/or Preferred
            Stock who are also receiving Conversion Amounts or Proceeds on a
            similar as-converted to Common Stock basis, and (B) junior to
            payments described in clauses (i) and (ii) above (in the latter
            case, to the extent such payments are Cash-Out Amounts or similar
            liquidation preferences).
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (e) <Text style={{ textDecoration: "underline" }}>Termination</Text>
            . This Safe will automatically terminate (without relieving the
            Company of any obligations arising from a prior breach of or
            non-compliance with this Safe) immediately following the earliest to
            occur of: (i) the issuance of Capital Stock to the Investor pursuant
            to the automatic conversion of this Safe under Section 1(a); or (ii)
            the payment, or setting aside for payment, of amounts due the
            Investor pursuant to Section 1(b) or Section 1(c).
          </Indent>
        </Text>

        <Text style={[style.pt20]}>
          <Indent size="sm">2. Definitions</Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Capital Stock” means the capital stock of the Company, including,
            without limitation, the “Common Stock” and the “Preferred Stock.”
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Change of Control” means (i) a transaction or series of related
            transactions in which any “person” or “group” (within the meaning of
            Section 13(d) and 14(d) of the Securities Exchange Act of 1934, as
            amended), becomes the “beneficial owner” (as defined in Rule 13d-3
            under the Securities Exchange Act of 1934, as amended), directly or
            indirectly, of more than 50% of the outstanding voting securities of
            the Company having the right to vote for the election of members of
            the Company’s board of directors, (ii) any reorganization, merger or
            consolidation of the Company, other than a transaction or series of
            related transactions in which the holders of the voting securities
            of the Company outstanding immediately prior to such transaction or
            series of related transactions retain, immediately after such
            transaction or series of related transactions, at least a majority
            of the total voting power represented by the outstanding voting
            securities of the Company or such other surviving or resulting
            entity or (iii) a sale, lease or other disposition of all or
            substantially all of the assets of the Company.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Company Capitalization” is calculated as of immediately prior to
            the Equity Financing and (without double-counting, in each case
            calculated on an as-converted to Common Stock basis):
          </Indent>
        </Text>

        {/* List */}
        <View
          style={{
            marginHorizontal: "40px",
            flexDirection: "column",
            marginTop: "10",
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ marginHorizontal: 8 }}>•</Text>
            <Text>
              Includes all shares of Capital Stock issued and outstanding;
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ marginHorizontal: 8 }}>•</Text>
            <Text>Includes all Converting Securities;</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ marginHorizontal: 8 }}>•</Text>
            <Text>
              Includes all (i) issued and outstanding Options and (ii) Promised
              Options; and
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ marginHorizontal: 8 }}>•</Text>
            <Text>
              Includes the Unissued Option Pool, except that any increase to the
              Unissued Option Pool in connection with the Equity Financing will
              only be included to the extent that the number of Promised Options
              exceeds the Unissued Option Pool prior to such increase.
            </Text>
          </View>
        </View>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Converting Securities” includes this Safe and other convertible
            securities issued by the Company, including but not limited to: (i)
            other Safes; (ii) convertible promissory notes and other convertible
            debt instruments; and (iii) convertible securities that have the
            right to convert into shares of Capital Stock.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Direct Listing” means the Company’s initial listing of its Common
            Stock (other than shares of Common Stock not eligible for resale
            under Rule 144 under the Securities Act) on a national securities
            exchange by means of an effective registration statement on Form S-1
            filed by the Company with the SEC that registers shares of existing
            capital stock of the Company for resale, as approved by the
            Company’s board of directors. For the avoidance of doubt, a Direct
            Listing will not be deemed to be an underwritten offering and will
            not involve any underwriting services.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Dissolution Event” means (i) a voluntary termination of operations,
            (ii) a general assignment for the benefit of the Company’s creditors
            or (iii) any other liquidation, dissolution or winding up of the
            Company (excluding a Liquidity Event), whether voluntary or
            involuntary.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Dividend Amount” means, with respect to any date on which the
            Company pays a dividend on its outstanding Common Stock, the amount
            of such dividend that is paid per share of Common Stock multiplied
            by (x) the Purchase Amount divided by (y) the Liquidity Price
            (treating the dividend date as a Liquidity Event solely for purposes
            of calculating such Liquidity Price).
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Equity Financing” means a bona fide transaction or series of
            transactions with the principal purpose of raising capital, pursuant
            to which the Company issues and sells Preferred Stock at a fixed
            valuation, including but not limited to, a pre-money or post-money
            valuation.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Initial Public Offering” means the closing of the Company’s first
            firm commitment underwritten initial public offering of Common Stock
            pursuant to a registration statement filed under the Securities Act.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Liquidity Capitalization” is calculated as of immediately prior to
            the Liquidity Event, and (without double- counting, in each case
            calculated on an as-converted to Common Stock basis):{" "}
          </Indent>
        </Text>

        <View
          style={{
            marginHorizontal: "40px",
            flexDirection: "column",
            marginTop: "10",
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ marginHorizontal: 8 }}>•</Text>
            <Text>
              Includes all shares of Capital Stock issued and outstanding;
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ marginHorizontal: 8 }}>•</Text>
            <Text>
              Includes all (i) issued and outstanding Options and (ii) to the
              extent receiving Proceeds, Promised Options;
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ marginHorizontal: 8 }}>•</Text>
            <Text>
              Includes all Converting Securities, other than any Safes and other
              convertible securities (including without limitation shares of
              Preferred Stock) where the holders of such securities are
              receiving Cash-Out Amounts or similar liquidation preference
              payments in lieu of Conversion Amounts or similar “as-converted”
              payments; and
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ marginHorizontal: 8 }}>•</Text>
            <Text>Excludes the Unissued Option Pool.</Text>
          </View>
        </View>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Liquidity Event” means a Change of Control, a Direct Listing or an
            Initial Public Offering.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Liquidity Price” means the price per share equal to the Post-Money
            Valuation Cap divided by the Liquidity Capitalization.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Options” includes options, restricted stock awards or purchases,
            RSUs, SARs, warrants or similar securities, vested or unvested.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Proceeds” means cash and other assets (including without limitation
            stock consideration) that are proceeds from the Liquidity Event or
            the Dissolution Event, as applicable, and legally available for
            distribution.{" "}
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Promised Options” means promised but ungranted Options that are the
            greater of those (i) promised pursuant to agreements or
            understandings made prior to the execution of, or in connection
            with, the term sheet or letter of intent for the Equity Financing or
            Liquidity Event, as applicable (or the initial closing of the Equity
            Financing or consummation of the Liquidity Event, if there is no
            term sheet or letter of intent), (ii) in the case of an Equity
            Financing, treated as outstanding Options in the calculation of the
            Standard Preferred Stock’s price per share, or (iii) in the case of
            a Liquidity Event, treated as outstanding Options in the calculation
            of the distribution of the Proceeds.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Safe” means an instrument containing a future right to shares of
            Capital Stock, similar in form and content to this instrument,
            purchased by investors for the purpose of funding the Company’s
            business operations. References to “this Safe” mean this specific
            instrument.{" "}
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Safe Preferred Stock” means the shares of the series of Preferred
            Stock issued to the Investor in an Equity Financing, having the
            identical rights, privileges, preferences, seniority, liquidation
            multiple and restrictions as the shares of Standard Preferred Stock,
            except that any price-based preferences (such as the per share
            liquidation amount, initial conversion price and per share dividend
            amount) will be based on the Safe Price.{" "}
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Safe Price” means the price per share equal to the Post-Money
            Valuation Cap divided by the Company Capitalization.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Standard Preferred Stock” means the shares of the series of
            Preferred Stock issued to the investors investing new money in the
            Company in connection with the initial closing of the Equity
            Financing.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            “Unissued Option Pool” means all shares of Capital Stock that are
            reserved, available for future grant and not subject to any
            outstanding Options or Promised Options (but in the case of a
            Liquidity Event, only to the extent Proceeds are payable on such
            Promised Options) under any equity incentive or similar Company
            plan.
          </Indent>
        </Text>

        <Text style={[style.pt20]}>
          <Indent>3. Company Representations</Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (a) The Company is a corporation duly organized, validly existing
            and in good standing under the laws of its state of incorporation,
            and has the power and authority to own, lease and operate its
            properties and carry on its business as now conducted.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (b) The execution, delivery and performance by the Company of this
            Safe is within the power of the Company and has been duly authorized
            by all necessary actions on the part of the Company (subject to
            section 3(d)). This Safe constitutes a legal, valid and binding
            obligation of the Company, enforceable against the Company in
            accordance with its terms, except as limited by bankruptcy,
            insolvency or other laws of general application relating to or
            affecting the enforcement of creditors’ rights generally and general
            principles of equity. To its knowledge, the Company is not in
            violation of (i) its current certificate of incorporation or bylaws,
            (ii) any material statute, rule or regulation applicable to the
            Company or (iii) any material debt or contract to which the Company
            is a party or by which it is bound, where, in each case, such
            violation or default, individually, or together with all such
            violations or defaults, could reasonably be expected to have a
            material adverse effect on the Company.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (c) The performance and consummation of the transactions
            contemplated by this Safe do not and will not: (i) violate any
            material judgment, statute, rule or regulation applicable to the
            Company; (ii) result in the acceleration of any material debt or
            contract to which the Company is a party or by which it is bound; or
            (iii) result in the creation or imposition of any lien on any
            property, asset or revenue of the Company or the suspension,
            forfeiture, or nonrenewal of any material permit, license or
            authorization applicable to the Company, its business or operations.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (d) No consents or approvals are required in connection with the
            performance of this Safe, other than: (i) the Company’s corporate
            approvals; (ii) any qualifications or filings under applicable
            securities laws; and (iii) necessary corporate approvals for the
            authorization of Capital Stock issuable pursuant to Section 1.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (e) To its knowledge, the Company owns or possesses (or can obtain
            on commercially reasonable terms) sufficient legal rights to all
            patents, trademarks, service marks, trade names, copyrights, trade
            secrets, licenses, information, processes and other intellectual
            property rights necessary for its business as now conducted and as
            currently proposed to be conducted, without any conflict with, or
            infringement of the rights of, others.
          </Indent>
        </Text>

        <Text style={[style.pt20]}>
          <Indent>4. Investor Representations</Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (a) The Investor has full legal capacity, power and authority to
            execute and deliver this Safe and to perform its obligations
            hereunder. This Safe constitutes a valid and binding obligation of
            the Investor, enforceable in accordance with its terms, except as
            limited by bankruptcy, insolvency or other laws of general
            application relating to or affecting the enforcement of creditors’
            rights generally and general principles of equity.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (b) The Investor is an accredited investor as such term is defined
            in Rule 501 of Regulation D under the Securities Act, and
            acknowledges and agrees that if not an accredited investor at the
            time of an Equity Financing, the Company may void this Safe and
            return the Purchase Amount. The Investor has been advised that this
            Safe and the underlying securities have not been registered under
            the Securities Act, or any state securities laws and, therefore,
            cannot be resold unless they are registered under the Securities Act
            and applicable state securities laws or unless an exemption from
            such registration requirements is available. The Investor is
            purchasing this Safe and the securities to be acquired by the
            Investor hereunder for its own account for investment, not as a
            nominee or agent, and not with a view to, or for resale in
            connection with, the distribution thereof, and the Investor has no
            present intention of selling, granting any participation in, or
            otherwise distributing the same. The Investor has such knowledge and
            experience in financial and business matters that the Investor is
            capable of evaluating the merits and risks of such investment, is
            able to incur a complete loss of such investment without impairing
            the Investor’s financial condition and is able to bear the economic
            risk of such investment for an indefinite period of time.{" "}
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent>5. Miscellaneous</Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (a) Any provision of this Safe may be amended, waived or modified by
            written consent of the Company and either (i) the Investor or (ii)
            the majority-in-interest of all then-outstanding Safes with the same
            “Post-Money Valuation Cap” and “Discount Rate” as this Safe (and
            Safes lacking one or both of such terms will be considered to be the
            same with respect to such term(s)), provided that with respect to
            clause (ii): (A) the Purchase Amount may not be amended, waived or
            modified in this manner, (B) the consent of the Investor and each
            holder of such Safes must be solicited (even if not obtained), and
            (C) such amendment, waiver or modification treats all such holders
            in the same manner. “Majority-in-interest” refers to the holders of
            the applicable group of Safes whose Safes have a total Purchase
            Amount greater than 50% of the total Purchase Amount of all of such
            applicable group of Safes.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (b) Any notice required or permitted by this Safe will be deemed
            sufficient when delivered personally or by overnight courier or sent
            by email to the relevant address listed on the signature page, or 48
            hours after being deposited in the U.S. mail as certified or
            registered mail with postage prepaid, addressed to the party to be
            notified at such party’s address listed on the signature page, as
            subsequently modified by written notice.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (c) The Investor is not entitled, as a holder of this Safe, to vote
            or be deemed a holder of Capital Stock for any purpose other than
            tax purposes, nor will anything in this Safe be construed to confer
            on the Investor, as such, any rights of a Company stockholder or
            rights to vote for the election of directors or on any matter
            submitted to Company stockholders, or to give or withhold consent to
            any corporate action or to receive notice of meetings, until shares
            have been issued on the terms described in Section 1. However, if
            the Company pays a dividend on outstanding shares of Common Stock
            (that is not payable in shares of Common Stock) while this Safe is
            outstanding, the Company will pay the Dividend Amount to the
            Investor at the same time.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (d) Neither this Safe nor the rights in this Safe are transferable
            or assignable, by operation of law or otherwise, by either party
            without the prior written consent of the other; provided, however,
            that this Safe and/or its rights may be assigned without the
            Company’s consent by the Investor (i) to the Investor’s estate,
            heirs, executors, administrators, guardians and/or successors in the
            event of Investor’s death or disability, or (ii) to any other entity
            who directly or indirectly, controls, is controlled by or is under
            common control with the Investor, including, without limitation, any
            general partner, managing member, officer or director of the
            Investor, or any venture capital fund now or hereafter existing
            which is controlled by one or more general partners or managing
            members of, or shares the same management company with, the
            Investor.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (e) In the event any one or more of the provisions of this Safe is
            for any reason held to be invalid, illegal or unenforceable, in
            whole or in part or in any respect, or in the event that any one or
            more of the provisions of this Safe operate or would prospectively
            operate to invalidate this Safe, then and in any such event, such
            provision(s) only will be deemed null and void and will not affect
            any other provision of this Safe and the remaining provisions of
            this Safe will remain operative and in full force and effect and
            will not be affected, prejudiced, or disturbed thereby.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (f) All rights and obligations hereunder will be governed by the
            laws of the State of [Governing Law Jurisdiction], without regard to
            the conflicts of law provisions of such jurisdiction.
          </Indent>
        </Text>

        <Text style={[style.pt10]}>
          <Indent size="md">
            (g) The parties acknowledge and agree that for United States federal
            and state income tax purposes this Safe is, and at all times has
            been, intended to be characterized as stock, and more particularly
            as common stock for purposes of Sections 304, 305, 306, 354, 368,
            1036 and 1202 of the Internal Revenue Code of 1986, as amended.
            Accordingly, the parties agree to treat this Safe consistent with
            the foregoing intent for all United States federal and state income
            tax purposes (including, without limitation, on their respective tax
            returns or other informational statements).
          </Indent>
        </Text>

        <Text style={[style.bold, style.center, style.pt10]}>
          (Signature page follows)
        </Text>
      </Page>

      <Page size={"A4"} style={style.body}>
        <Text>
          IN WITNESS WHEREOF, the undersigned have caused this Safe to be duly
          executed and delivered.
        </Text>

        <View style={style.pt20}>
          <Text style={[style.title, { color: "blue" }]}>{company.name}</Text>

          {sender?.signature ? (
            <View style={[style.pb20, style.pt20, style.signatureRow]}>
              <Text>
                By (signature):{" "}
                {!sender.signature.startsWith("data:image/")
                  ? sender?.signature
                  : null}
              </Text>

              {sender.signature.startsWith("data:image/") ? (
                <Image
                  style={{
                    width: 50,
                  }}
                  src={sender.signature}
                />
              ) : null}
            </View>
          ) : null}

          {sender?.name ? (
            <Text style={style.pb20}>Name: {sender.name}</Text>
          ) : null}

          {sender?.title ? (
            <Text style={style.pb20}>Title: {sender?.title}</Text>
          ) : null}

          {company?.address ? (
            <Text style={style.pb20}>Address: {company?.address}</Text>
          ) : null}

          <Text style={style.pb20}>
            ______________________________________________
          </Text>
          {sender?.email ? (
            <Text style={style.pb20}>Email: {sender?.email}</Text>
          ) : null}
        </View>

        <View style={style.pt20}>
          <Text style={[style.title]}>INVESTOR:</Text>

          {investor?.signature ? (
            <View style={[style.pb20, style.pt20, style.signatureRow]}>
              <Text>
                By (signature):{" "}
                {!investor.signature.startsWith("data:image/")
                  ? investor?.signature
                  : null}
              </Text>

              {investor.signature.startsWith("data:image/") ? (
                <Image
                  style={{
                    width: 50,
                  }}
                  src={investor.signature}
                />
              ) : null}
            </View>
          ) : null}

          {investor.name ? (
            <Text style={style.pb20}>Name: {investor.name}</Text>
          ) : null}

          {investor.title ? (
            <Text style={style.pb20}>Title: {investor.title}</Text>
          ) : null}

          {investor.address ? (
            <Text style={style.pb20}>Address: {investor.address}</Text>
          ) : null}

          <Text style={style.pb20}>
            ______________________________________________
          </Text>
          {investor.email ? (
            <Text style={style.pb20}>Email: {investor.email}</Text>
          ) : null}
        </View>
      </Page>
    </Document>
  );
};

export default PostMoneyDiscount;
